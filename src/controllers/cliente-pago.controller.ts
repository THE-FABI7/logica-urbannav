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
  Cliente,
  Pago,
} from '../models';
import {ClienteRepository} from '../repositories';

export class ClientePagoController {
  constructor(
    @repository(ClienteRepository) protected clienteRepository: ClienteRepository,
  ) { }

  @get('/clientes/{id}/pagos', {
    responses: {
      '200': {
        description: 'Array of Cliente has many Pago',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Pago)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Pago>,
  ): Promise<Pago[]> {
    return this.clienteRepository.pagos(id).find(filter);
  }

  @post('/clientes/{id}/pagos', {
    responses: {
      '200': {
        description: 'Cliente model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pago)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Cliente.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pago, {
            title: 'NewPagoInCliente',
            exclude: ['id'],
            optional: ['clienteId']
          }),
        },
      },
    }) pago: Omit<Pago, 'id'>,
  ): Promise<Pago> {
    return this.clienteRepository.pagos(id).create(pago);
  }

  @patch('/clientes/{id}/pagos', {
    responses: {
      '200': {
        description: 'Cliente.Pago PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pago, {partial: true}),
        },
      },
    })
    pago: Partial<Pago>,
    @param.query.object('where', getWhereSchemaFor(Pago)) where?: Where<Pago>,
  ): Promise<Count> {
    return this.clienteRepository.pagos(id).patch(pago, where);
  }

  @del('/clientes/{id}/pagos', {
    responses: {
      '200': {
        description: 'Cliente.Pago DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Pago)) where?: Where<Pago>,
  ): Promise<Count> {
    return this.clienteRepository.pagos(id).delete(where);
  }
}
