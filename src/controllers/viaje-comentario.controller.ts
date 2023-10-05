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
  Comentario,
} from '../models';
import {ViajeRepository} from '../repositories';

export class ViajeComentarioController {
  constructor(
    @repository(ViajeRepository) protected viajeRepository: ViajeRepository,
  ) { }

  @get('/viajes/{id}/comentario', {
    responses: {
      '200': {
        description: 'Viaje has one Comentario',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Comentario),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Comentario>,
  ): Promise<Comentario> {
    return this.viajeRepository.comentario(id).get(filter);
  }

  @post('/viajes/{id}/comentario', {
    responses: {
      '200': {
        description: 'Viaje model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comentario)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Viaje.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comentario, {
            title: 'NewComentarioInViaje',
            exclude: ['id'],
            optional: ['viajeId']
          }),
        },
      },
    }) comentario: Omit<Comentario, 'id'>,
  ): Promise<Comentario> {
    return this.viajeRepository.comentario(id).create(comentario);
  }

  @patch('/viajes/{id}/comentario', {
    responses: {
      '200': {
        description: 'Viaje.Comentario PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comentario, {partial: true}),
        },
      },
    })
    comentario: Partial<Comentario>,
    @param.query.object('where', getWhereSchemaFor(Comentario)) where?: Where<Comentario>,
  ): Promise<Count> {
    return this.viajeRepository.comentario(id).patch(comentario, where);
  }

  @del('/viajes/{id}/comentario', {
    responses: {
      '200': {
        description: 'Viaje.Comentario DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Comentario)) where?: Where<Comentario>,
  ): Promise<Count> {
    return this.viajeRepository.comentario(id).delete(where);
  }
}
