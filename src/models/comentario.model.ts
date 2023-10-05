import {Entity, model, property} from '@loopback/repository';

@model()
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


  constructor(data?: Partial<Comentario>) {
    super(data);
  }
}

export interface ComentarioRelations {
  // describe navigational properties here
}

export type ComentarioWithRelations = Comentario & ComentarioRelations;
