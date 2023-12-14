import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
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
import {Viaje} from '../models';
import {ConductorRepository, ViajeRepository} from '../repositories';
import {GraphService} from '../services';
import {ConductorController} from './conductor.controller';

export class ViajeController {
  constructor(
    @repository(ViajeRepository)
    public viajeRepository: ViajeRepository,
    @service(GraphService)
    public graphService: GraphService,
    @repository(ConductorRepository)
    public ConductorRepository: ConductorRepository,
    @inject('controllers.ConductorController')
    public conductorController: ConductorController,
  ) { }


  @post('/solicitarViaje')
  @response(200, {
    description: 'Viaje model instance',
    content: {'application/json': {schema: getModelSchemaRef(Viaje)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Viaje, {
            title: 'NewViaje',
            exclude: ['id', 'conductorId', 'facturaId', 'comentarioId', 'estadoSolicitudId', 'Fecha'],
          }),
        },
      },
    })
    viaje: Omit<Viaje, 'id'>,
  ): Promise<number | undefined> {
    viaje.Fecha = String(new Date());
    viaje.estadoSolicitudId = 1;
    const respuesta = this.viajeRepository.create(viaje);
    return (await respuesta).getId();
  }

  @post('/buscarConductoresCercanos')
  @response(200, {
    description: 'Array of conductorIds for nearby drivers',
    content: {'application/json': {schema: {type: 'array', items: {type: 'number'}}}},
  })
  async buscarConductoresCercanos(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ubicacion: {type: 'string'},
            },
            required: ['ubicacion'],
          },
        },
      },
    })
    body: {ubicacion: string},
  ): Promise<number[] | null> {
    try {
      // Get nearby node IDs using the provided location
      const result = await this.graphService.getNearbyNodeIds(body.ubicacion, 4000);

      // Find free drivers in the nearby locations
      const conductorIds = await this.findFreeConductores(result);

      return conductorIds;
    } catch (error) {
      console.error(error);
      throw new Error('Error al buscar conductores cercanos.');
    }
  }
  async findFreeConductores(ubicaciones: string[]): Promise<number[]> {
    const conductorIds: number[] = [];

    for (const ubicacion of ubicaciones) {
      // Find a free driver in the current location
      const conductorLibre = await this.ConductorRepository.findOne({
        where: {
          Ubicacion: ubicacion,
          Estado: 'LIBRE',
        },
      });

      if (conductorLibre) {
        conductorIds.push(conductorLibre.id!);
      }
    }

    return conductorIds;
  }



  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuViajeId, configuracionSeguridad.listarAccion]
  })
  @get('/viaje/count')
  @response(200, {
    description: 'Viaje model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Viaje) where?: Where<Viaje>,
  ): Promise<Count> {
    return this.viajeRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuViajeId, configuracionSeguridad.listarAccion]
  })
  @get('/viaje')
  @response(200, {
    description: 'Array of Viaje model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Viaje, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Viaje) filter?: Filter<Viaje>,
  ): Promise<Viaje[]> {
    return this.viajeRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuViajeId, configuracionSeguridad.editarAccion]
  })
  @patch('/viaje')
  @response(200, {
    description: 'Viaje PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Viaje, {partial: true}),
        },
      },
    })
    viaje: Viaje,
    @param.where(Viaje) where?: Where<Viaje>,
  ): Promise<Count> {
    return this.viajeRepository.updateAll(viaje, where);
  }

  @patch('/asignarConductor')
  @response(200, {
    description: 'Viaje model instance with updated conductorId',
    content: {'application/json': {schema: getModelSchemaRef(Viaje)}},
  })
  async asignarConductor(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              viajeId: {type: 'number'},
              conductorId: {type: 'number'},
            },
            required: ['viajeId', 'conductorId'],
          },
        },
      },
    })
    body: {viajeId: number; conductorId: number},
  ): Promise<Viaje | {message: string}> {
    try {
      // Find the viaje by ID
      const existingViaje = await this.viajeRepository.findById(body.viajeId);

      if (!existingViaje) {
        throw new Error('No se encontró el viaje con el ID proporcionado.');
      }

      // Update the conductorId
      existingViaje.conductorId = body.conductorId;

      // Save the updated viaje
      const updatedViaje = await this.viajeRepository.update(existingViaje);

      // Return the updated viaje
      return updatedViaje!;
    } catch (error) {
      console.error(error);
      throw new Error('Error al asignar el conductor al viaje.');
    }
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuViajeId, configuracionSeguridad.listarAccion]
  })
  @get('/viaje/{id}')
  @response(200, {
    description: 'Viaje model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Viaje, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Viaje, {exclude: 'where'}) filter?: FilterExcludingWhere<Viaje>
  ): Promise<Viaje> {
    return this.viajeRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuViajeId, configuracionSeguridad.editarAccion]
  })
  @patch('/viaje/{id}')
  @response(204, {
    description: 'Viaje PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Viaje, {partial: true}),
        },
      },
    })
    viaje: Viaje,
  ): Promise<void> {
    await this.viajeRepository.updateById(id, viaje);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuViajeId, configuracionSeguridad.editarAccion]
  })
  @put('/viaje/{id}')
  @response(204, {
    description: 'Viaje PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() viaje: Viaje,
  ): Promise<void> {
    await this.viajeRepository.replaceById(id, viaje);
  }

  @authenticate({
    strategy: 'auth',
    options: [configuracionSeguridad.menuViajeId, configuracionSeguridad.eliminarAccion]
  })
  @del('/viaje/{id}')
  @response(204, {
    description: 'Viaje DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.viajeRepository.deleteById(id);
  }
}
