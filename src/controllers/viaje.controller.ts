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
  ): Promise<Viaje | {message: string}> {
    viaje.Fecha = String(new Date());

    try {
      const result = await this.graphService.getNearbyNodeIds(viaje.Origen, 3000);

      // Buscar un conductor libre en una de las ubicaciones cercanas
      const conductorLibre = await this.findFreeConductor(result);

      // Asignar el conductor al viaje
      if (conductorLibre) {
        viaje.conductorId = conductorLibre;

        await this.conductorController.ocuparConductor(conductorLibre);

      } else {
        // Manejar el caso en que no hay conductores libres en las ubicaciones cercanas
        return {message: 'No hay conductores libres en las ubicaciones cercanas.'};
      }

    } catch (error) {
      console.error(error);
      throw new Error('Error al calcular la distancia y el costo del viaje.');
    }

    return this.viajeRepository.create(viaje);
  }
  async findFreeConductor(ubicaciones: string[]): Promise<number | null> {
    for (const ubicacion of ubicaciones) {
      // Buscar un conductor libre en la ubicación actual
      const conductorLibre = await this.ConductorRepository.findOne({
        where: {
          Ubicacion: ubicacion,
          Estado: 'LIBRE',
        },
      });

      if (conductorLibre) {
        return conductorLibre.id!;
      }
    }
    // Devolver null si no se encontró ningún conductor libre en las ubicaciones
    return null;
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
