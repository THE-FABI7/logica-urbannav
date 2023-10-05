import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Conductor, ConductorRelations, Viaje, Automovil} from '../models';
import {ViajeRepository} from './viaje.repository';
import {AutomovilRepository} from './automovil.repository';

export class ConductorRepository extends DefaultCrudRepository<
  Conductor,
  typeof Conductor.prototype.id,
  ConductorRelations
> {

  public readonly viajes: HasManyRepositoryFactory<Viaje, typeof Conductor.prototype.id>;

  public readonly automovil: HasOneRepositoryFactory<Automovil, typeof Conductor.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ViajeRepository') protected viajeRepositoryGetter: Getter<ViajeRepository>, @repository.getter('AutomovilRepository') protected automovilRepositoryGetter: Getter<AutomovilRepository>,
  ) {
    super(Conductor, dataSource);
    this.automovil = this.createHasOneRepositoryFactoryFor('automovil', automovilRepositoryGetter);
    this.registerInclusionResolver('automovil', this.automovil.inclusionResolver);
    this.viajes = this.createHasManyRepositoryFactoryFor('viajes', viajeRepositoryGetter,);
    this.registerInclusionResolver('viajes', this.viajes.inclusionResolver);
  }
}
