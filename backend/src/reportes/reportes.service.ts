import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { RangoFechasDto } from './dto/rango-fechas.dto';

function clausulaFechas(dto: RangoFechasDto, columna: string, params: unknown[]) {
  const condiciones: string[] = [];
  if (dto.desde) {
    params.push(dto.desde);
    condiciones.push(`${columna} >= $${params.length}`);
  }
  if (dto.hasta) {
    params.push(dto.hasta);
    condiciones.push(`${columna} <= $${params.length}`);
  }
  return condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';
}

@Injectable()
export class ReportesService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async cierresCaja(dto: RangoFechasDto) {
    const params: unknown[] = [];
    const filtroFechas = clausulaFechas(dto, 'tc.cerrado_at', params);

    const result = await this.pool.query(
      `SELECT tc.id, tc.numero, c.nombre AS caja_nombre, tc.abierto_at, tc.cerrado_at,
              tc.fondo_inicial, tc.total_ventas, tc.cantidad_ventas, tc.total_efectivo,
              tc.total_mp, tc.total_tarjeta, tc.total_transferencia, tc.total_saldo,
              tc.efectivo_declarado, tc.diferencia
       FROM turnos_caja tc
       JOIN cajas c ON c.id = tc.caja_id
       WHERE tc.estado = 'cerrado' ${filtroFechas}
       ORDER BY tc.cerrado_at DESC`,
      params,
    );

    const numericas = [
      'fondo_inicial', 'total_ventas', 'total_efectivo', 'total_mp',
      'total_tarjeta', 'total_transferencia', 'total_saldo', 'efectivo_declarado', 'diferencia',
    ];
    return result.rows.map((row) => {
      const mapped = { ...row };
      for (const campo of numericas) {
        if (mapped[campo] !== null) mapped[campo] = parseFloat(mapped[campo]);
      }
      return mapped;
    });
  }

  async ventasPorMedioPago(dto: RangoFechasDto) {
    const params: unknown[] = [];
    const filtroFechas = clausulaFechas(dto, 'created_at', params);

    const result = await this.pool.query(
      `SELECT medio_pago, COUNT(*) AS cantidad, SUM(total) AS total
       FROM ventas
       WHERE estado = 'completada' ${filtroFechas}
       GROUP BY medio_pago
       ORDER BY total DESC`,
      params,
    );
    return result.rows.map((row) => ({
      ...row,
      cantidad: parseInt(row.cantidad, 10),
      total: parseFloat(row.total),
    }));
  }

  async rankingProductos(limite: number) {
    const result = await this.pool.query(
      `SELECT vi.producto_id, vi.nombre,
              SUM(vi.cantidad) AS cantidad_vendida,
              SUM(vi.cantidad * vi.precio_unit) AS total_facturado
       FROM venta_items vi
       JOIN ventas v ON v.id = vi.venta_id
       WHERE v.estado = 'completada'
       GROUP BY vi.producto_id, vi.nombre
       ORDER BY cantidad_vendida DESC
       LIMIT $1`,
      [limite],
    );
    return result.rows.map((row) => ({
      ...row,
      cantidad_vendida: parseInt(row.cantidad_vendida, 10),
      total_facturado: parseFloat(row.total_facturado),
    }));
  }

  async aforoEventos() {
    const result = await this.pool.query(
      `SELECT ev.id AS evento_id, ev.nombre AS evento_nombre, ev.fecha,
              te.id AS tipo_entrada_id, te.nombre AS tipo_nombre, te.cupo, te.vendidas,
              ROUND((te.vendidas::numeric / NULLIF(te.cupo, 0)) * 100, 1) AS porcentaje_ocupado
       FROM tipos_entrada te
       JOIN eventos ev ON ev.id = te.evento_id
       WHERE ev.activo = true
       ORDER BY ev.fecha ASC, te.nombre`,
    );
    return result.rows.map((row) => ({
      ...row,
      porcentaje_ocupado: row.porcentaje_ocupado !== null ? parseFloat(row.porcentaje_ocupado) : 0,
    }));
  }

  async saldoTotalTarjetas() {
    const result = await this.pool.query(
      `SELECT COALESCE(SUM(saldo), 0) AS saldo_total,
              COUNT(*) FILTER (WHERE saldo > 0) AS tarjetas_con_saldo
       FROM tarjetas`,
    );
    return {
      saldoTotal: parseFloat(result.rows[0].saldo_total),
      tarjetasConSaldo: parseInt(result.rows[0].tarjetas_con_saldo, 10),
    };
  }

  async ocupacionRutas() {
    const result = await this.pool.query(
      `SELECT id, origen, destino, asientos, disponibles,
              (asientos - disponibles) AS reservados,
              ROUND(((asientos - disponibles)::numeric / NULLIF(asientos, 0)) * 100, 1) AS porcentaje_ocupado
       FROM rutas
       WHERE activo = true
       ORDER BY origen`,
    );
    return result.rows.map((row) => ({
      ...row,
      porcentaje_ocupado: row.porcentaje_ocupado !== null ? parseFloat(row.porcentaje_ocupado) : 0,
    }));
  }
}
