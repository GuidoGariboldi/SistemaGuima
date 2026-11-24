import { randomUUID } from 'crypto';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { TarjetasService } from '../tarjetas/tarjetas.service';

@Injectable()
export class PagosService {
  private readonly mpClient: MercadoPagoConfig;

  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly tarjetasService: TarjetasService,
    private readonly config: ConfigService,
  ) {
    this.mpClient = new MercadoPagoConfig({
      accessToken: this.config.getOrThrow<string>('MERCADOPAGO_ACCESS_TOKEN'),
    });
  }

  // Crea la preferencia de pago en Mercado Pago y devuelve la URL a la que
  // hay que redirigir al socio. El external_reference arranca con su id
  // para poder comprobar, cuando vuelva, que el pago le pertenece a él y
  // no a otro socio que haya compartido o reusado un paymentId.
  async crearPreferencia(socioId: string, monto: number) {
    // Falla rápido si todavía no vinculó una tarjeta física, o si la tiene
    // pausada: no tiene sentido mandarlo a pagar si después no se le puede
    // acreditar el saldo (fn_cargar_saldo lo rechaza igual, pero mejor
    // avisarle antes de que pague que después de que ya pagó).
    const tarjeta = await this.tarjetasService.findBySocio(socioId);
    if (tarjeta.estado !== 'activa') {
      throw new ForbiddenException('Tu tarjeta está pausada. Reactivala antes de cargar saldo.');
    }

    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    const externalReference = `${socioId}:${randomUUID()}`;

    const preference = new Preference(this.mpClient);
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'carga-saldo',
            title: 'Carga de saldo - La Bastarda',
            quantity: 1,
            unit_price: monto,
            currency_id: 'ARS',
          },
        ],
        external_reference: externalReference,
        back_urls: {
          success: `${frontendUrl}/#/carga/resultado`,
          pending: `${frontendUrl}/#/carga/resultado`,
          failure: `${frontendUrl}/#/carga/resultado`,
        },
        // Mercado Pago rechaza auto_return cuando el back_url apunta a
        // localhost ("auto_return invalid. back_url.success must be
        // defined"). En local el usuario vuelve con el botón "Volver al
        // sitio" de su propia pantalla de resultado; en producción, con un
        // dominio real, se puede reactivar auto_return: 'approved'.
      },
    });

    return { initPoint: result.init_point ?? result.sandbox_init_point, externalReference };
  }

  // Confirma un pago cuando el socio vuelve de Mercado Pago con un
  // payment_id en la URL (flujo de redirect con back_urls, útil cuando el
  // sitio está en un dominio público). Nunca confía en el status/monto que
  // vengan por query param: siempre vuelve a consultar la API de MP.
  async confirmarPago(paymentId: string, socioId: string) {
    const payment = new Payment(this.mpClient);
    const pago = await payment.get({ id: paymentId });
    return this.procesarPago(pago, socioId);
  }

  // Alternativa para desarrollo local: el checkout se abre en otra pestaña
  // (no hay dominio público al que Mercado Pago pueda redirigir), así que
  // el frontend va preguntando acá, por external_reference, si ese pago ya
  // se aprobó. Misma garantía que confirmarPago: todo se verifica contra
  // la API de MP, nunca contra lo que diga el cliente.
  async verificarPago(externalReference: string, socioId: string) {
    if (!externalReference.startsWith(`${socioId}:`)) {
      throw new ForbiddenException('Este pago no te pertenece');
    }

    const payment = new Payment(this.mpClient);
    const resultado = await payment.search({ options: { external_reference: externalReference } });
    const encontrado = resultado.results?.[0];
    if (!encontrado) {
      return { estado: 'pendiente', tarjeta: null };
    }

    return this.procesarPago(encontrado, socioId);
  }

  private async procesarPago(pago: { id?: string | number; status?: string; external_reference?: string; transaction_amount?: number }, socioId: string) {
    const [ownerId] = (pago.external_reference ?? '').split(':');
    if (ownerId !== socioId) {
      throw new ForbiddenException('Este pago no te pertenece');
    }

    if (pago.status !== 'approved') {
      return { estado: pago.status ?? 'desconocido', tarjeta: null };
    }

    const tarjeta = await this.tarjetasService.findBySocio(socioId);
    const paymentId = String(pago.id);

    // Idempotencia: si ya acreditamos este pago antes (ej. el socio sigue
    // viendo la pantalla de espera y el polling pregunta de nuevo después
    // de acreditar), no lo volvemos a sumar.
    const yaAcreditado = await this.pool.query(
      `SELECT 1 FROM movimientos_saldo WHERE referencia_pago = $1`,
      [paymentId],
    );
    if (yaAcreditado.rowCount! > 0) {
      return { estado: 'approved', tarjeta };
    }

    const tarjetaActualizada = await this.tarjetasService.cargarSaldo(tarjeta.card_uid, {
      monto: pago.transaction_amount ?? 0,
      medioPago: 'mercadopago',
      referenciaPago: paymentId,
    });

    return { estado: 'approved', tarjeta: tarjetaActualizada };
  }
}
