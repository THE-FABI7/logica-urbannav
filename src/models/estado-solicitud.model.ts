import {Entity, hasOne, model, property} from '@loopback/repository';
import {Viaje} from './viaje.model';

@model({
  settings: {
    foreignKeys: {
      fk_estadoSolicitud_idViaje: {
        name: 'fk_estadoSolitud_idViaje',
        entity: 'Viaje',
        entityKey: 'id',
        foreignKey: 'viajeId',
      },
    },
  },
},)
export class EstadoSolicitud extends Entity {
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
  Estado: string;

  @property({
    type: 'number',
  })
  viajeId?: number;

  @hasOne(() => Viaje)
  viaje: Viaje;

  constructor(data?: Partial<EstadoSolicitud>) {
    super(data);
  }
}

export interface EstadoSolicitudRelations {
  // describe navigational properties here
}

export type EstadoSolicitudWithRelations = EstadoSolicitud & EstadoSolicitudRelations;
