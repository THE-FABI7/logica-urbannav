import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {configuracionSeguridad} from '../config/configuracion.seguridad';
import {Conductor} from '../models';
import {ConductorRepository} from '../repositories';

export class ConductorController {
  constructor(
    @repository(ConductorRepository)
    public conductorRepository: ConductorRepository,
  ) { }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuConductorId, configuracionSeguridad.guardarAccion]
  })
  @post('/conductor')
  @response(200, {
    description: 'Conductor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Conductor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Conductor, {
            title: 'NewConductor',
            exclude: ['id'],
          }),
        },
      },
    })
    conductor: Omit<Conductor, 'id'>,
  ): Promise<Conductor> {
    return this.conductorRepository.create(conductor);
  }


  @post('/conductor-publico')
  @response(200, {
    description: 'Conductor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Conductor)}},
  })
  async createConductorPublico(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Conductor, {
            title: 'NewConductor',
            exclude: ['id'],
          }),
        },
      },
    })
    conductor: Omit<Conductor, 'id'>,
  ): Promise<Conductor> {
    return this.conductorRepository.create(conductor);
  }


  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuConductorId, configuracionSeguridad.listarAccion]
  })
  @get('/conductor/count')
  @response(200, {
    description: 'Conductor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Conductor) where?: Where<Conductor>,
  ): Promise<Count> {
    return this.conductorRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuConductorId, configuracionSeguridad.listarAccion]
  })
  @get('/conductor')
  @response(200, {
    description: 'Array of Conductor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Conductor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Conductor) filter?: Filter<Conductor>,
  ): Promise<Conductor[]> {
    return this.conductorRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuConductorId, configuracionSeguridad.editarAccion]
  })
  @patch('/conductor')
  @response(200, {
    description: 'Conductor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Conductor, {partial: true}),
        },
      },
    })
    conductor: Conductor,
    @param.where(Conductor) where?: Where<Conductor>,
  ): Promise<Count> {
    return this.conductorRepository.updateAll(conductor, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuConductorId, configuracionSeguridad.listarAccion]
  })
  @get('/conductor/{id}')
  @response(200, {
    description: 'Conductor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Conductor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Conductor, {exclude: 'where'}) filter?: FilterExcludingWhere<Conductor>
  ): Promise<Conductor> {
    return this.conductorRepository.findById(id, filter);
  }

  @post('/conductor/findByCorreo')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Conductor)}}
  })
  async findByCorreo(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              Correo: {type: 'string'},
            },
          },
        },
      },
    })
    body: {Correo: string},
  ): Promise<Conductor | null> {
    try {
      const foundConductor = await this.conductorRepository.findOne({
        where: {Correo: body.Correo},
      });

      return foundConductor;
    } catch (error) {
      console.error('Error al buscar conductor por correo:', error);
      throw error;
    }
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuConductorId, configuracionSeguridad.editarAccion]
  })
  @patch('/conductor/{id}')
  @response(204, {
    description: 'Conductor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Conductor, {partial: true}),
        },
      },
    })
    conductor: Conductor,
  ): Promise<void> {
    await this.conductorRepository.updateById(id, conductor);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuConductorId, configuracionSeguridad.editarAccion]
  })
  @put('/conductor/{id}')
  @response(204, {
    description: 'Conductor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() conductor: Conductor,
  ): Promise<void> {
    await this.conductorRepository.replaceById(id, conductor);
  }

  @patch('/conductor/{id}/estado')
  @response(204, {
    description: 'Conductor PATCH success',
  })
  async ocuparConductor(
    @param.path.number('id') id: number,
  ): Promise<void> {
    const conductor: Conductor = await this.conductorRepository.findById(id);

    if (!conductor) {
      throw new Error(`Conductor con ID ${id} no encontrado.`);
    }

    // Actualizar el estado a "OCUPADO"
    conductor.Estado = 'OCUPADO';

    // Guardar el cambio
    await this.conductorRepository.update(conductor);
  }
  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuConductorId, configuracionSeguridad.eliminarAccion]
  })
  @del('/conductor/{id}')
  @response(204, {
    description: 'Conductor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.conductorRepository.deleteById(id);
  }
}
