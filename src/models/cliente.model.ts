import {Entity, model, property, hasMany} from '@loopback/repository';
import {Viaje} from './viaje.model';
import {Pago} from './pago.model';

@model()
export class Cliente extends Entity {
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
    type: 'string',
    required: true,
  })
  FechaDeNacimiento: string;

  @property({
    type: 'string',
    required: true,
  })
  NumEmergencia: string;

  @hasMany(() => Viaje)
  viajes: Viaje[];

  @hasMany(() => Pago)
  pagos: Pago[];

  constructor(data?: Partial<Cliente>) {
    super(data);
  }
}

export interface ClienteRelations {
  // describe navigational properties here
}

export type ClienteWithRelations = Cliente & ClienteRelations;
