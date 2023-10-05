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
  EstadoSolicitud,
  Viaje,
} from '../models';
import {EstadoSolicitudRepository} from '../repositories';

export class EstadoSolicitudViajeController {
  constructor(
    @repository(EstadoSolicitudRepository) protected estadoSolicitudRepository: EstadoSolicitudRepository,
  ) { }

  @get('/estado-solicituds/{id}/viaje', {
    responses: {
      '200': {
        description: 'EstadoSolicitud has one Viaje',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Viaje),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Viaje>,
  ): Promise<Viaje> {
    return this.estadoSolicitudRepository.viaje(id).get(filter);
  }

  @post('/estado-solicituds/{id}/viaje', {
    responses: {
      '200': {
        description: 'EstadoSolicitud model instance',
        content: {'application/json': {schema: getModelSchemaRef(Viaje)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof EstadoSolicitud.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Viaje, {
            title: 'NewViajeInEstadoSolicitud',
            exclude: ['id'],
            optional: ['estadoSolicitudId']
          }),
        },
      },
    }) viaje: Omit<Viaje, 'id'>,
  ): Promise<Viaje> {
    return this.estadoSolicitudRepository.viaje(id).create(viaje);
  }

  @patch('/estado-solicituds/{id}/viaje', {
    responses: {
      '200': {
        description: 'EstadoSolicitud.Viaje PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Viaje, {partial: true}),
        },
      },
    })
    viaje: Partial<Viaje>,
    @param.query.object('where', getWhereSchemaFor(Viaje)) where?: Where<Viaje>,
  ): Promise<Count> {
    return this.estadoSolicitudRepository.viaje(id).patch(viaje, where);
  }

  @del('/estado-solicituds/{id}/viaje', {
    responses: {
      '200': {
        description: 'EstadoSolicitud.Viaje DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Viaje)) where?: Where<Viaje>,
  ): Promise<Count> {
    return this.estadoSolicitudRepository.viaje(id).delete(where);
  }
}
