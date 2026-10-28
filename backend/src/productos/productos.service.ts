import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

 @Injectable()

 export class ProductosService{
    constructor(@Inject(PG_POOL) private readonly pool: Pool){}

    private mapProductos(row:any){
        return{
            ...row,
            precio: parseFloat(row.precio),
            costo: row.costo !== null ? parseFloat(row.costo) : null,
        };
    }

    async findAll(pagination : PaginationDto){
        const result = await this.pool.query(
            `SELECT id,nombre,categoria,precio,costo,stock,activo
            FROM productos
            WHERE activo = true
            ORDER BY categoria,nombre
            LIMIT $1 OFFSET $2`,
            [pagination.limit, pagination.offset],
        );
        return result.rows.map((row)=> this.mapProductos(row));
    }

    async findOne(id: string){
        const result = await this.pool.query(
            `SELECT id,nombre,categoria,precio,costo,stock,activo
            FROM productos
            WHERE id = $1`,
            [id],
        );
        if(result.rowCount === 0){
            throw new NotFoundException(`Producto con ${id} no encontrado`);
        }
        return this.mapProductos(result.rows[0]);
    }

    async create(dto: CrearProductoDto){
        const result = await this.pool.query(
            `INSERT INTO productos (nombre,categoria,precio,stock,costo)
            VALUES($1, $2, $3, $4, $5)
            RETURNING id,nombre,categoria,precio,costo,stock,activo`,
            [dto.nombre, dto.categoria, dto.precio, dto.stock ?? 0 ,dto.costo ?? null],        
        );
        return this.mapProductos(result.rows[0]);
    };

async update(id: string, dto: ActualizarProductoDto) {
  await this.findOne(id);

  const campos: string[] = [];
  const valores: unknown[] = [];
  let i = 1;

  for (const [clave, valor] of Object.entries(dto)) {
    if (valor === undefined) continue;
    campos.push(`${clave} = $${i}`);
    valores.push(valor);
    i++;
  }

  if (campos.length === 0) return this.findOne(id);

  valores.push(id);
  const result = await this.pool.query(
    `UPDATE productos SET ${campos.join(', ')}
     WHERE id = $${i}
     RETURNING id, nombre, categoria, precio, costo, stock, activo`,
    valores,
  );
  return this.mapProductos(result.rows[0]);
}
async remove(id: string) {
  await this.findOne(id);
  await this.pool.query('UPDATE productos SET activo = false WHERE id = $1', [id]);
  return { ok: true };
}
    
 }