import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Automovil, AutomovilRelations} from '../models';

export class AutomovilRepository extends DefaultCrudRepository<
  Automovil,
  typeof Automovil.prototype.id,
  AutomovilRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Automovil, dataSource);
  }
}
