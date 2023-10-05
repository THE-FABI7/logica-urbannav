import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Automovil, AutomovilRelations, Conductor} from '../models';
import {ConductorRepository} from './conductor.repository';

export class AutomovilRepository extends DefaultCrudRepository<
  Automovil,
  typeof Automovil.prototype.id,
  AutomovilRelations
> {

  public readonly conductor: HasOneRepositoryFactory<Conductor, typeof Automovil.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ConductorRepository') protected conductorRepositoryGetter: Getter<ConductorRepository>,
  ) {
    super(Automovil, dataSource);
    this.conductor = this.createHasOneRepositoryFactoryFor('conductor', conductorRepositoryGetter);
    this.registerInclusionResolver('conductor', this.conductor.inclusionResolver);
  }
}
