import {Entity, hasOne, model, property} from '@loopback/repository';
import {Viaje} from './viaje.model';

@model({
  settings: {
    foreignKeys: {
      fk_comentario_idViaje: {
        name: 'fk_comentario_idViaje',
        entity: 'Viaje',
        entityKey: 'id',
        foreignKey: 'viajeId',
      },
    },
  },
},)
export class Comentario extends Entity {
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
  CalificacionConductor: number;

  @property({
    type: 'string',
  })
  ComentarioConductor?: string;

  @property({
    type: 'number',
    required: true,
  })
  CalificacionCliente: number;

  @property({
    type: 'string',
  })
  ComentarioCliente?: string;

  @property({
    type: 'number',
  })
  viajeId?: number;

  @hasOne(() => Viaje)
  viaje: Viaje;

  constructor(data?: Partial<Comentario>) {
    super(data);
  }
}

export interface ComentarioRelations {
  // describe navigational properties here
}

export type ComentarioWithRelations = Comentario & ComentarioRelations;
