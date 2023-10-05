import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {EstadoSolicitud, EstadoSolicitudRelations, Viaje} from '../models';
import {ViajeRepository} from './viaje.repository';

export class EstadoSolicitudRepository extends DefaultCrudRepository<
  EstadoSolicitud,
  typeof EstadoSolicitud.prototype.id,
  EstadoSolicitudRelations
> {

  public readonly viaje: HasOneRepositoryFactory<Viaje, typeof EstadoSolicitud.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ViajeRepository') protected viajeRepositoryGetter: Getter<ViajeRepository>,
  ) {
    super(EstadoSolicitud, dataSource);
    this.viaje = this.createHasOneRepositoryFactoryFor('viaje', viajeRepositoryGetter);
    this.registerInclusionResolver('viaje', this.viaje.inclusionResolver);
  }
}
