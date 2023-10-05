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
  Comentario,
  Viaje,
} from '../models';
import {ComentarioRepository} from '../repositories';

export class ComentarioViajeController {
  constructor(
    @repository(ComentarioRepository) protected comentarioRepository: ComentarioRepository,
  ) { }

  @get('/comentarios/{id}/viaje', {
    responses: {
      '200': {
        description: 'Comentario has one Viaje',
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
    return this.comentarioRepository.viaje(id).get(filter);
  }

  @post('/comentarios/{id}/viaje', {
    responses: {
      '200': {
        description: 'Comentario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Viaje)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Comentario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Viaje, {
            title: 'NewViajeInComentario',
            exclude: ['id'],
            optional: ['comentarioId']
          }),
        },
      },
    }) viaje: Omit<Viaje, 'id'>,
  ): Promise<Viaje> {
    return this.comentarioRepository.viaje(id).create(viaje);
  }

  @patch('/comentarios/{id}/viaje', {
    responses: {
      '200': {
        description: 'Comentario.Viaje PATCH success count',
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
    return this.comentarioRepository.viaje(id).patch(viaje, where);
  }

  @del('/comentarios/{id}/viaje', {
    responses: {
      '200': {
        description: 'Comentario.Viaje DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Viaje)) where?: Where<Viaje>,
  ): Promise<Count> {
    return this.comentarioRepository.viaje(id).delete(where);
  }
}
