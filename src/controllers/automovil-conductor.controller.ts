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
  Automovil,
  Conductor,
} from '../models';
import {AutomovilRepository} from '../repositories';

export class AutomovilConductorController {
  constructor(
    @repository(AutomovilRepository) protected automovilRepository: AutomovilRepository,
  ) { }

  @get('/automovils/{id}/conductor', {
    responses: {
      '200': {
        description: 'Automovil has one Conductor',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Conductor),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Conductor>,
  ): Promise<Conductor> {
    return this.automovilRepository.conductor(id).get(filter);
  }

  @post('/automovils/{id}/conductor', {
    responses: {
      '200': {
        description: 'Automovil model instance',
        content: {'application/json': {schema: getModelSchemaRef(Conductor)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Automovil.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Conductor, {
            title: 'NewConductorInAutomovil',
            exclude: ['id'],
            optional: ['automovilId']
          }),
        },
      },
    }) conductor: Omit<Conductor, 'id'>,
  ): Promise<Conductor> {
    return this.automovilRepository.conductor(id).create(conductor);
  }

  @patch('/automovils/{id}/conductor', {
    responses: {
      '200': {
        description: 'Automovil.Conductor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Conductor, {partial: true}),
        },
      },
    })
    conductor: Partial<Conductor>,
    @param.query.object('where', getWhereSchemaFor(Conductor)) where?: Where<Conductor>,
  ): Promise<Count> {
    return this.automovilRepository.conductor(id).patch(conductor, where);
  }

  @del('/automovils/{id}/conductor', {
    responses: {
      '200': {
        description: 'Automovil.Conductor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Conductor)) where?: Where<Conductor>,
  ): Promise<Count> {
    return this.automovilRepository.conductor(id).delete(where);
  }
}
