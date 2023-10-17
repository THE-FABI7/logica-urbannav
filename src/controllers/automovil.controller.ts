import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Automovil} from '../models';
import {AutomovilRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {configuracionSeguridad} from '../config/configuracion.seguridad';

export class AutomovilController {
  constructor(
    @repository(AutomovilRepository)
    public automovilRepository: AutomovilRepository,
  ) { }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuAutomovilId, configuracionSeguridad.guardarAccion]
  })
  @post('/automovil')
  @response(200, {
    description: 'Automovil model instance',
    content: {'application/json': {schema: getModelSchemaRef(Automovil)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Automovil, {
            title: 'NewAutomovil',
            exclude: ['id'],
          }),
        },
      },
    })
    automovil: Omit<Automovil, 'id'>,
  ): Promise<Automovil> {
    return this.automovilRepository.create(automovil);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuAutomovilId, configuracionSeguridad.listarAccion]
  })
  @get('/automovil/count')
  @response(200, {
    description: 'Automovil model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Automovil) where?: Where<Automovil>,
  ): Promise<Count> {
    return this.automovilRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuAutomovilId, configuracionSeguridad.listarAccion]
  })
  @get('/automovil')
  @response(200, {
    description: 'Array of Automovil model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Automovil, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Automovil) filter?: Filter<Automovil>,
  ): Promise<Automovil[]> {
    return this.automovilRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuAutomovilId, configuracionSeguridad.editarAccion]
  })
  @patch('/automovil')
  @response(200, {
    description: 'Automovil PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Automovil, {partial: true}),
        },
      },
    })
    automovil: Automovil,
    @param.where(Automovil) where?: Where<Automovil>,
  ): Promise<Count> {
    return this.automovilRepository.updateAll(automovil, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuAutomovilId, configuracionSeguridad.listarAccion]
  })
  @get('/automovil/{id}')
  @response(200, {
    description: 'Automovil model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Automovil, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Automovil, {exclude: 'where'}) filter?: FilterExcludingWhere<Automovil>
  ): Promise<Automovil> {
    return this.automovilRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuAutomovilId, configuracionSeguridad.editarAccion]
  })
  @patch('/automovil/{id}')
  @response(204, {
    description: 'Automovil PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Automovil, {partial: true}),
        },
      },
    })
    automovil: Automovil,
  ): Promise<void> {
    await this.automovilRepository.updateById(id, automovil);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuAutomovilId, configuracionSeguridad.editarAccion]
  })
  @put('/automovil/{id}')
  @response(204, {
    description: 'Automovil PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() automovil: Automovil,
  ): Promise<void> {
    await this.automovilRepository.replaceById(id, automovil);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuAutomovilId, configuracionSeguridad.eliminarAccion]
  })
  @del('/automovil/{id}')
  @response(204, {
    description: 'Automovil DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.automovilRepository.deleteById(id);
  }
}
