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
  Pago,
  Factura,
} from '../models';
import {PagoRepository} from '../repositories';

export class PagoFacturaController {
  constructor(
    @repository(PagoRepository) protected pagoRepository: PagoRepository,
  ) { }

  @get('/pagos/{id}/facturas', {
    responses: {
      '200': {
        description: 'Array of Pago has many Factura',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Factura)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Factura>,
  ): Promise<Factura[]> {
    return this.pagoRepository.destinodepago(id).find(filter);
  }

  @post('/pagos/{id}/facturas', {
    responses: {
      '200': {
        description: 'Pago model instance',
        content: {'application/json': {schema: getModelSchemaRef(Factura)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Pago.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {
            title: 'NewFacturaInPago',
            exclude: ['id'],
            optional: ['pagoId']
          }),
        },
      },
    }) factura: Omit<Factura, 'id'>,
  ): Promise<Factura> {
    return this.pagoRepository.destinodepago(id).create(factura);
  }

  @patch('/pagos/{id}/facturas', {
    responses: {
      '200': {
        description: 'Pago.Factura PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {partial: true}),
        },
      },
    })
    factura: Partial<Factura>,
    @param.query.object('where', getWhereSchemaFor(Factura)) where?: Where<Factura>,
  ): Promise<Count> {
    return this.pagoRepository.destinodepago(id).patch(factura, where);
  }

  @del('/pagos/{id}/facturas', {
    responses: {
      '200': {
        description: 'Pago.Factura DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Factura)) where?: Where<Factura>,
  ): Promise<Count> {
    return this.pagoRepository.destinodepago(id).delete(where);
  }
}
