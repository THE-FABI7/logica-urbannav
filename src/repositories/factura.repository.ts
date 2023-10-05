import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Factura, FacturaRelations, Pago, Viaje} from '../models';
import {PagoRepository} from './pago.repository';
import {ViajeRepository} from './viaje.repository';

export class FacturaRepository extends DefaultCrudRepository<
  Factura,
  typeof Factura.prototype.id,
  FacturaRelations
> {

  public readonly pago: BelongsToAccessor<Pago, typeof Factura.prototype.id>;

  public readonly viaje: HasOneRepositoryFactory<Viaje, typeof Factura.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PagoRepository') protected pagoRepositoryGetter: Getter<PagoRepository>, @repository.getter('ViajeRepository') protected viajeRepositoryGetter: Getter<ViajeRepository>,
  ) {
    super(Factura, dataSource);
    this.viaje = this.createHasOneRepositoryFactoryFor('viaje', viajeRepositoryGetter);
    this.registerInclusionResolver('viaje', this.viaje.inclusionResolver);
    this.pago = this.createBelongsToAccessorFor('pago', pagoRepositoryGetter,);
    this.registerInclusionResolver('pago', this.pago.inclusionResolver);
  }
}
