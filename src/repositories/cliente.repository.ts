import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Cliente, ClienteRelations, Viaje, Pago} from '../models';
import {ViajeRepository} from './viaje.repository';
import {PagoRepository} from './pago.repository';

export class ClienteRepository extends DefaultCrudRepository<
  Cliente,
  typeof Cliente.prototype.id,
  ClienteRelations
> {

  public readonly viajes: HasManyRepositoryFactory<Viaje, typeof Cliente.prototype.id>;

  public readonly pagos: HasManyRepositoryFactory<Pago, typeof Cliente.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ViajeRepository') protected viajeRepositoryGetter: Getter<ViajeRepository>, @repository.getter('PagoRepository') protected pagoRepositoryGetter: Getter<PagoRepository>,
  ) {
    super(Cliente, dataSource);
    this.pagos = this.createHasManyRepositoryFactoryFor('pagos', pagoRepositoryGetter,);
    this.registerInclusionResolver('pagos', this.pagos.inclusionResolver);
    this.viajes = this.createHasManyRepositoryFactoryFor('viajes', viajeRepositoryGetter,);
    this.registerInclusionResolver('viajes', this.viajes.inclusionResolver);
  }
}
