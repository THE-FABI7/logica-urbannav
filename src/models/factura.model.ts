import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Pago} from './pago.model';
import {Viaje} from './viaje.model';

@model()
export class Factura extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  Precio: number;

  @belongsTo(() => Pago)
  pagoId: number;

  @hasOne(() => Viaje)
  viaje: Viaje;

  @property({
    type: 'number',
  })
  viajeId?: number;

  constructor(data?: Partial<Factura>) {
    super(data);
  }
}

export interface FacturaRelations {
  // describe navigational properties here
}

export type FacturaWithRelations = Factura & FacturaRelations;
