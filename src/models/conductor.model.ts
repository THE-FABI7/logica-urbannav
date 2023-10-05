import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Viaje} from './viaje.model';
import {Automovil} from './automovil.model';

@model()
export class Conductor extends Entity {
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
  Nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  Apellido: string;

  @property({
    type: 'string',
    required: true,
  })
  Foto: string;

  @property({
    type: 'string',
    required: true,
  })
  Telefono: string;

  @property({
    type: 'string',
    required: true,
  })
  Correo: string;

  @property({
    type: 'date',
    required: true,
  })
  FechaDeNacimiento: string;

  @property({
    type: 'date',
    required: true,
  })
  Vigencia: string;

  @hasMany(() => Viaje)
  viajes: Viaje[];

  @hasOne(() => Automovil)
  automovil: Automovil;

  @property({
    type: 'number',
  })
  automovilId?: number;

  constructor(data?: Partial<Conductor>) {
    super(data);
  }
}

export interface ConductorRelations {
  // describe navigational properties here
}

export type ConductorWithRelations = Conductor & ConductorRelations;
