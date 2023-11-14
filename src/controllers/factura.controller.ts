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
import axios from 'axios';
import {configuracionSeguridad} from '../config/configuracion.seguridad';
import {Factura} from '../models';
import {ClienteRepository, FacturaRepository, PagoRepository, ViajeRepository} from '../repositories';

export class FacturaController {
  constructor(
    @repository(FacturaRepository)
    public facturaRepository: FacturaRepository,
    @repository(PagoRepository)
    public pagoRepository: PagoRepository,
    @repository(ViajeRepository)
    public viajeRepository: ViajeRepository,
    @repository(ClienteRepository)
    public clienteRepository: ClienteRepository,
  ) { }


  //TODO: HACER EL METODO PARA GENERAR LA FACTURA
  @post('/generar-factura')
  @response(200, {
    description: 'Factura model instance',
    content: {'application/json': {schema: getModelSchemaRef(Factura)}},
  })
  async generateFactura(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {
            title: 'NewFactura',
            exclude: ['id'],
          }),
        },
      },
    })
    factura: Omit<Factura, 'idFactura'>,
  ): Promise<Factura> {
    let facturaCreada = await this.facturaRepository.create(factura);
    let viaje = await this.viajeRepository.findById(factura.viajeId);
    let cliente = await this.clienteRepository.findById(viaje.clienteId);
    axios.post('http://localhost:5178/correo-bienvenida', {
      to: cliente.Correo,
      name: cliente.Nombre,
      content: `Hola ${cliente.Nombre} ${cliente.Apellido}, tu factura del viaje ${viaje.id} es de pesos.`,
      subject: 'Factura de viaje'
    })
    return facturaCreada;
  }


  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuFacturaId, configuracionSeguridad.guardarAccion]
  })
  @post('/factura')
  @response(200, {
    description: 'Factura model instance',
    content: {'application/json': {schema: getModelSchemaRef(Factura)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {
            title: 'NewFactura',
            exclude: ['id'],
          }),
        },
      },
    })
    factura: Omit<Factura, 'id'>,
  ): Promise<Factura> {
    return this.facturaRepository.create(factura);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuFacturaId, configuracionSeguridad.listarAccion]
  })
  @get('/factura/count')
  @response(200, {
    description: 'Factura model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Factura) where?: Where<Factura>,
  ): Promise<Count> {
    return this.facturaRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuFacturaId, configuracionSeguridad.listarAccion]
  })
  @get('/factura')
  @response(200, {
    description: 'Array of Factura model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Factura, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Factura) filter?: Filter<Factura>,
  ): Promise<Factura[]> {
    return this.facturaRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuFacturaId, configuracionSeguridad.editarAccion]
  })
  @patch('/factura')
  @response(200, {
    description: 'Factura PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {partial: true}),
        },
      },
    })
    factura: Factura,
    @param.where(Factura) where?: Where<Factura>,
  ): Promise<Count> {
    return this.facturaRepository.updateAll(factura, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuFacturaId, configuracionSeguridad.listarAccion]
  })
  @get('/factura/{id}')
  @response(200, {
    description: 'Factura model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Factura, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Factura, {exclude: 'where'}) filter?: FilterExcludingWhere<Factura>
  ): Promise<Factura> {
    return this.facturaRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuFacturaId, configuracionSeguridad.editarAccion]
  })
  @patch('/factura/{id}')
  @response(204, {
    description: 'Factura PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {partial: true}),
        },
      },
    })
    factura: Factura,
  ): Promise<void> {
    await this.facturaRepository.updateById(id, factura);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuFacturaId, configuracionSeguridad.editarAccion]
  })
  @put('/factura/{id}')
  @response(204, {
    description: 'Factura PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() factura: Factura,
  ): Promise<void> {
    await this.facturaRepository.replaceById(id, factura);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuFacturaId, configuracionSeguridad.eliminarAccion]
  })
  @del('/factura/{id}')
  @response(204, {
    description: 'Factura DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.facturaRepository.deleteById(id);
  }
}
