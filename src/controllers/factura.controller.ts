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
//import axios from 'axios';
import {service} from '@loopback/core';
import {configuracionSeguridad} from '../config/configuracion.seguridad';
import {configuracionNotificaciones} from '../config/notificaciones.config';
import {Factura} from '../models';
import {ClienteRepository, ConductorRepository, FacturaRepository, PagoRepository, ViajeRepository} from '../repositories';
import {NotificacionesService} from '../services/notificaciones.service';
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
    @repository(ConductorRepository)
    public conductorRepository: ConductorRepository,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
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
    let conductor = await this.conductorRepository.findById(viaje.conductorId);

    console.log(viaje.id);

    //Notificar de la creacion de cuenta via correo electronico
    try {
      let datos = {
        correoDestino: cliente.Correo,
        nombreDestino: cliente.Nombre,
        asuntoCorreo: 'Factura de viaje',
        contenidoCorreo: `factura numero: ${viaje.id}.\n
                          Cliente: ${cliente.Nombre + " " + cliente.Apellido}.\n
                          Conductor: ${conductor.Nombre + " " + conductor.Apellido}.\n
                          Origen: ${viaje.Origen}.\n
                          Destino: ${viaje.Destino}.\n
                          \n-----------------------------\n
                          Valor: ${factura.Precio} COP`,
        Viajeid: viaje.id?.toString(),
      };

      let url = configuracionNotificaciones.Facturacion;
      try {
        this.servicioNotificaciones.EnviarNotificacion(datos, url);
        console.log('Mensaje aceptado');
      } catch (error) {
        console.log('error');
      }
    } catch (error) {
      console.log(error);
    }

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
