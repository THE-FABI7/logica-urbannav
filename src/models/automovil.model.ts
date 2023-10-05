import {Entity, model, property, hasOne} from '@loopback/repository';
import {Conductor} from './conductor.model';

@model()
export class Automovil extends Entity {
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
  Marca: string;

  @property({
    type: 'string',
    required: true,
  })
  Foto: string;

  @property({
    type: 'string',
    required: true,
  })
  Modelo: string;

  @property({
    type: 'string',
    required: true,
  })
  Placa: string;

  @property({
    type: 'string',
    required: true,
  })
  FechaDelAutomovil: string;

  @property({
    type: 'date',
    required: true,
  })
  Soat: string;

  @property({
    type: 'number',
  })
  conductorId?: number;

  @hasOne(() => Conductor)
  conductor: Conductor;

  constructor(data?: Partial<Automovil>) {
    super(data);
  }
}

export interface AutomovilRelations {
  // describe navigational properties here
}

export type AutomovilWithRelations = Automovil & AutomovilRelations;
