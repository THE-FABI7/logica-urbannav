import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Viaje, ViajeRelations, Cliente, Conductor, Factura, Comentario, EstadoSolicitud} from '../models';
import {ClienteRepository} from './cliente.repository';
import {ConductorRepository} from './conductor.repository';
import {FacturaRepository} from './factura.repository';
import {ComentarioRepository} from './comentario.repository';
import {EstadoSolicitudRepository} from './estado-solicitud.repository';

export class ViajeRepository extends DefaultCrudRepository<
  Viaje,
  typeof Viaje.prototype.id,
  ViajeRelations
> {

  public readonly cliente: BelongsToAccessor<Cliente, typeof Viaje.prototype.id>;

  public readonly conductor: BelongsToAccessor<Conductor, typeof Viaje.prototype.id>;

  public readonly factura: HasOneRepositoryFactory<Factura, typeof Viaje.prototype.id>;

  public readonly comentario: HasOneRepositoryFactory<Comentario, typeof Viaje.prototype.id>;

  public readonly solicitud: HasOneRepositoryFactory<EstadoSolicitud, typeof Viaje.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>, @repository.getter('ConductorRepository') protected conductorRepositoryGetter: Getter<ConductorRepository>, @repository.getter('FacturaRepository') protected facturaRepositoryGetter: Getter<FacturaRepository>, @repository.getter('ComentarioRepository') protected comentarioRepositoryGetter: Getter<ComentarioRepository>, @repository.getter('EstadoSolicitudRepository') protected estadoSolicitudRepositoryGetter: Getter<EstadoSolicitudRepository>,
  ) {
    super(Viaje, dataSource);
    this.solicitud = this.createHasOneRepositoryFactoryFor('solicitud', estadoSolicitudRepositoryGetter);
    this.registerInclusionResolver('solicitud', this.solicitud.inclusionResolver);
    this.comentario = this.createHasOneRepositoryFactoryFor('comentario', comentarioRepositoryGetter);
    this.registerInclusionResolver('comentario', this.comentario.inclusionResolver);
    this.factura = this.createHasOneRepositoryFactoryFor('factura', facturaRepositoryGetter);
    this.registerInclusionResolver('factura', this.factura.inclusionResolver);
    this.conductor = this.createBelongsToAccessorFor('conductor', conductorRepositoryGetter,);
    this.registerInclusionResolver('conductor', this.conductor.inclusionResolver);
    this.cliente = this.createBelongsToAccessorFor('cliente', clienteRepositoryGetter,);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
  }
}
