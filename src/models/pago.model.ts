import {Entity, belongsTo, hasMany, model, property} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Factura} from './factura.model';

@model({
  settings: {
    foreignKeys: {
      fk_pago_idCliente: {
        name: 'fk_pago_idCliente',
        entity: 'Cliente',
        entityKey: 'id',
        foreignKey: 'clienteId',
      },
    },
  },
},)
export class Pago extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  MetodoDePago: string;

  @property({
    type: 'string',
  })
  Descripcion?: string;

  @belongsTo(() => Cliente)
  clienteId: number;

  @hasMany(() => Factura)
  destinodepago: Factura[];

  constructor(data?: Partial<Pago>) {
    super(data);
  }
}

export interface PagoRelations {
  // describe navigational properties here
}

export type PagoWithRelations = Pago & PagoRelations;
