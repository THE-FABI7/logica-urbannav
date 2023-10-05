import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Conductor} from './conductor.model';
import {Factura} from './factura.model';
import {Comentario} from './comentario.model';
import {EstadoSolicitud} from './estado-solicitud.model';

@model()
export class Viaje extends Entity {
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
  Origen: string;

  @property({
    type: 'string',
    required: true,
  })
  Destino: string;

  @property({
    type: 'date',
    required: true,
  })
  Fecha: string;

  @belongsTo(() => Cliente)
  clienteId: number;

  @belongsTo(() => Conductor)
  conductorId: number;

  @property({
    type: 'number',
  })
  facturaId?: number;

  @hasOne(() => Factura)
  factura: Factura;

  @hasOne(() => Comentario)
  comentario: Comentario;

  @property({
    type: 'number',
  })
  comentarioId?: number;

  @hasOne(() => EstadoSolicitud)
  solicitud: EstadoSolicitud;

  @property({
    type: 'number',
  })
  estadoSolicitudId?: number;

  constructor(data?: Partial<Viaje>) {
    super(data);
  }
}

export interface ViajeRelations {
  // describe navigational properties here
}

export type ViajeWithRelations = Viaje & ViajeRelations;
