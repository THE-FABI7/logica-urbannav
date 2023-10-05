import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Comentario, ComentarioRelations, Viaje} from '../models';
import {ViajeRepository} from './viaje.repository';

export class ComentarioRepository extends DefaultCrudRepository<
  Comentario,
  typeof Comentario.prototype.id,
  ComentarioRelations
> {

  public readonly viaje: HasOneRepositoryFactory<Viaje, typeof Comentario.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ViajeRepository') protected viajeRepositoryGetter: Getter<ViajeRepository>,
  ) {
    super(Comentario, dataSource);
    this.viaje = this.createHasOneRepositoryFactoryFor('viaje', viajeRepositoryGetter);
    this.registerInclusionResolver('viaje', this.viaje.inclusionResolver);
  }
}
