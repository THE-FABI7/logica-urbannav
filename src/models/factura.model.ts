import {Entity, belongsTo, hasOne, model, property} from '@loopback/repository';
import {Pago} from './pago.model';
import {Viaje} from './viaje.model';

@model({
  settings: {
    foreignKeys: {
      fk_factura_idPago: {
        name: 'fk_factura_idPago',
        entity: 'Pago',
        entityKey: 'id',
        foreignKey: 'pagoId',
      },
      fk_factura_idViaje: {
        name: 'fk_factura_idViaje',
        entity: 'Viaje',
        entityKey: 'id',
        foreignKey: 'viajeId',
      },
    },
  },
},
)
export class Factura extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: false,
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
