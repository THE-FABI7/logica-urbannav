import {Entity, belongsTo, hasOne, model, property} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Comentario} from './comentario.model';
import {Conductor} from './conductor.model';
import {EstadoSolicitud} from './estado-solicitud.model';
import {Factura} from './factura.model';

@model({
  settings: {
    foreignKeys: {
      fk_viaje_idConductor: {
        name: 'fk_viaje_idConductor',
        entity: 'Conductor',
        entityKey: 'id',
        foreignKey: 'conductorId',
      },
      fk_viaje_idCliente: {
        name: 'fk_viaje_idCliente',
        entity: 'Cliente',
        entityKey: 'id',
        foreignKey: 'clienteId',
      },
      fk_viaje_idFactura: {
        name: 'fk_viaje_idFactura',
        entity: 'Factura',
        entityKey: 'id',
        foreignKey: 'facturaId',
      },
      fk_viaje_idComentario: {
        name: 'fk_viaje_idComentario',
        entity: 'Comentario',
        entityKey: 'id',
        foreignKey: 'comentarioId',
      },
      fk_viaje_idEstadoSolitud: {
        name: 'fk_viaje_idEstadoSolitud',
        entity: 'EstadoSolicitud',
        entityKey: 'id',
        foreignKey: 'estadoSolicitudId',
      },
    }
  },
},
)
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
