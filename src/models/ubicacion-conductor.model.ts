import {Model, model, property} from '@loopback/repository';

@model()
export class UbicacionConductor extends Model {
  @property({
    type: 'string',
    required: true,
  })
  idUbicacion: string;

  @property({
    type: 'string',
    required: true,
  })
  Correo: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  constructor(data?: Partial<UbicacionConductor>) {
    super(data);
  }
}

export interface UbicacionConductorRelations {
  // describe navigational properties here
}

export type UbicacionConductorWithRelations = UbicacionConductor &
  UbicacionConductorRelations;
