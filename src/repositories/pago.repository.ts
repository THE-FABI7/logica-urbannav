import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Pago, PagoRelations, Cliente, Factura} from '../models';
import {ClienteRepository} from './cliente.repository';
import {FacturaRepository} from './factura.repository';

export class PagoRepository extends DefaultCrudRepository<
  Pago,
  typeof Pago.prototype.id,
  PagoRelations
> {

  public readonly cliente: BelongsToAccessor<Cliente, typeof Pago.prototype.id>;

  public readonly destinodepago: HasManyRepositoryFactory<Factura, typeof Pago.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>, @repository.getter('FacturaRepository') protected facturaRepositoryGetter: Getter<FacturaRepository>,
  ) {
    super(Pago, dataSource);
    this.destinodepago = this.createHasManyRepositoryFactoryFor('destinodepago', facturaRepositoryGetter,);
    this.registerInclusionResolver('destinodepago', this.destinodepago.inclusionResolver);
    this.cliente = this.createBelongsToAccessorFor('cliente', clienteRepositoryGetter,);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
  }
}
