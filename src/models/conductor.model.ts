import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Automovil} from './automovil.model';
import {Viaje} from './viaje.model';

@model({
  settings: {
    foreignKeys: {
      fk_conductor_idAutomovil: {
        name: 'fk_conductor_idAutomovil',
        entity: 'Automovil',
        entityKey: 'id',
        foreignKey: 'automovilId',
      },
    },
  },
},
)
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
    type: 'string',
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

  @property({
    type: 'string',
  })
  Ubicacion?: string;

  @property({
    type: 'string',
    required: false,
  })
  Estado?: string;

  constructor(data?: Partial<Conductor>) {
    super(data);
  }
}

export interface ConductorRelations {
  // describe navigational properties here
}

export type ConductorWithRelations = Conductor & ConductorRelations;
