import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Viaje,
  EstadoSolicitud,
} from '../models';
import {ViajeRepository} from '../repositories';

export class ViajeEstadoSolicitudController {
  constructor(
    @repository(ViajeRepository) protected viajeRepository: ViajeRepository,
  ) { }

  @get('/viajes/{id}/estado-solicitud', {
    responses: {
      '200': {
        description: 'Viaje has one EstadoSolicitud',
        content: {
          'application/json': {
            schema: getModelSchemaRef(EstadoSolicitud),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<EstadoSolicitud>,
  ): Promise<EstadoSolicitud> {
    return this.viajeRepository.solicitud(id).get(filter);
  }

  @post('/viajes/{id}/estado-solicitud', {
    responses: {
      '200': {
        description: 'Viaje model instance',
        content: {'application/json': {schema: getModelSchemaRef(EstadoSolicitud)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Viaje.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadoSolicitud, {
            title: 'NewEstadoSolicitudInViaje',
            exclude: ['id'],
            optional: ['viajeId']
          }),
        },
      },
    }) estadoSolicitud: Omit<EstadoSolicitud, 'id'>,
  ): Promise<EstadoSolicitud> {
    return this.viajeRepository.solicitud(id).create(estadoSolicitud);
  }

  @patch('/viajes/{id}/estado-solicitud', {
    responses: {
      '200': {
        description: 'Viaje.EstadoSolicitud PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadoSolicitud, {partial: true}),
        },
      },
    })
    estadoSolicitud: Partial<EstadoSolicitud>,
    @param.query.object('where', getWhereSchemaFor(EstadoSolicitud)) where?: Where<EstadoSolicitud>,
  ): Promise<Count> {
    return this.viajeRepository.solicitud(id).patch(estadoSolicitud, where);
  }

  @del('/viajes/{id}/estado-solicitud', {
    responses: {
      '200': {
        description: 'Viaje.EstadoSolicitud DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(EstadoSolicitud)) where?: Where<EstadoSolicitud>,
  ): Promise<Count> {
    return this.viajeRepository.solicitud(id).delete(where);
  }
}
