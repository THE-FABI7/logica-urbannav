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
  Conductor,
  Automovil,
} from '../models';
import {ConductorRepository} from '../repositories';

export class ConductorAutomovilController {
  constructor(
    @repository(ConductorRepository) protected conductorRepository: ConductorRepository,
  ) { }

  @get('/conductors/{id}/automovil', {
    responses: {
      '200': {
        description: 'Conductor has one Automovil',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Automovil),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Automovil>,
  ): Promise<Automovil> {
    return this.conductorRepository.automovil(id).get(filter);
  }

  @post('/conductors/{id}/automovil', {
    responses: {
      '200': {
        description: 'Conductor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Automovil)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Conductor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Automovil, {
            title: 'NewAutomovilInConductor',
            exclude: ['id'],
            optional: ['conductorId']
          }),
        },
      },
    }) automovil: Omit<Automovil, 'id'>,
  ): Promise<Automovil> {
    return this.conductorRepository.automovil(id).create(automovil);
  }

  @patch('/conductors/{id}/automovil', {
    responses: {
      '200': {
        description: 'Conductor.Automovil PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Automovil, {partial: true}),
        },
      },
    })
    automovil: Partial<Automovil>,
    @param.query.object('where', getWhereSchemaFor(Automovil)) where?: Where<Automovil>,
  ): Promise<Count> {
    return this.conductorRepository.automovil(id).patch(automovil, where);
  }

  @del('/conductors/{id}/automovil', {
    responses: {
      '200': {
        description: 'Conductor.Automovil DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Automovil)) where?: Where<Automovil>,
  ): Promise<Count> {
    return this.conductorRepository.automovil(id).delete(where);
  }
}
