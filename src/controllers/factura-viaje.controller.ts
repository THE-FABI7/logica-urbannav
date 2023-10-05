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
  Factura,
  Viaje,
} from '../models';
import {FacturaRepository} from '../repositories';

export class FacturaViajeController {
  constructor(
    @repository(FacturaRepository) protected facturaRepository: FacturaRepository,
  ) { }

  @get('/facturas/{id}/viaje', {
    responses: {
      '200': {
        description: 'Factura has one Viaje',
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
    return this.facturaRepository.viaje(id).get(filter);
  }

  @post('/facturas/{id}/viaje', {
    responses: {
      '200': {
        description: 'Factura model instance',
        content: {'application/json': {schema: getModelSchemaRef(Viaje)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Factura.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Viaje, {
            title: 'NewViajeInFactura',
            exclude: ['id'],
            optional: ['facturaId']
          }),
        },
      },
    }) viaje: Omit<Viaje, 'id'>,
  ): Promise<Viaje> {
    return this.facturaRepository.viaje(id).create(viaje);
  }

  @patch('/facturas/{id}/viaje', {
    responses: {
      '200': {
        description: 'Factura.Viaje PATCH success count',
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
    return this.facturaRepository.viaje(id).patch(viaje, where);
  }

  @del('/facturas/{id}/viaje', {
    responses: {
      '200': {
        description: 'Factura.Viaje DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Viaje)) where?: Where<Viaje>,
  ): Promise<Count> {
    return this.facturaRepository.viaje(id).delete(where);
  }
}
