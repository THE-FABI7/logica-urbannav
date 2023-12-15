import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
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
import {Cliente} from '../models';
import {ClienteRepository, PagoRepository} from '../repositories';

export class ClienteController {
  constructor(
    @repository(ClienteRepository)
    public clienteRepository: ClienteRepository,
    @repository(PagoRepository)
    public pagoRepository: PagoRepository,
  ) { }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuClienteId, configuracionSeguridad.guardarAccion]
  })
  @post('/cliente')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    cliente: Omit<Cliente, 'id'>,
  ): Promise<Cliente> {
    return this.clienteRepository.create(cliente);
  }


  @post('/cliente-publico')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async createClientepublico(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    cliente: Omit<Cliente, 'id'>,
  ): Promise<Cliente> {
    let clienteCreado: Cliente;

    // Crear el cliente
    try {
      clienteCreado = await this.clienteRepository.create(cliente);
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      throw error;
    }
    return clienteCreado;
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuClienteId, configuracionSeguridad.listarAccion]
  })
  @get('/cliente/count')
  @response(200, {
    description: 'Cliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuClienteId, configuracionSeguridad.listarAccion]
  })
  @get('/cliente')
  @response(200, {
    description: 'Array of Cliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Cliente) filter?: Filter<Cliente>,
  ): Promise<Cliente[]> {
    return this.clienteRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuClienteId, configuracionSeguridad.editarAccion]
  })
  @patch('/cliente')
  @response(200, {
    description: 'Cliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.updateAll(cliente, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuClienteId, configuracionSeguridad.listarAccion]
  })
  @get('/cliente/{id}')
  @response(200, {
    description: 'Cliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Cliente, {exclude: 'where'}) filter?: FilterExcludingWhere<Cliente>
  ): Promise<Cliente> {
    return this.clienteRepository.findById(id, filter);
  }

  @post('/cliente/findByCorreo')
  @response(200, {
    description: 'ID of Cliente model instance',
    content: {'application/json': {schema: {type: 'number'}}},
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
  ): Promise<number | undefined> {
    try {
      const foundCliente = await this.clienteRepository.findOne({
        where: {Correo: body.Correo},
      });
      return foundCliente ? foundCliente.id : undefined;
    } catch (error) {
      console.error('Error al buscar cliente por correo:', error);
      throw error;
    }
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuClienteId, configuracionSeguridad.editarAccion]
  })
  @patch('/cliente/{id}')
  @response(204, {
    description: 'Cliente PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.updateById(id, cliente);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuClienteId, configuracionSeguridad.editarAccion]
  })
  @put('/cliente/{id}')
  @response(204, {
    description: 'Cliente PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.replaceById(id, cliente);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuClienteId, configuracionSeguridad.eliminarAccion]
  })
  @del('/cliente/{id}')
  @response(204, {
    description: 'Cliente DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.clienteRepository.deleteById(id);
  }
}
