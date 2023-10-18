import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {ConfiguracionEntorno} from '../config/configuracion.entorno';

const config = {
  name: 'mysql',
  connector: 'mysql',
  url: '',
  host: ConfiguracionEntorno.conexionRDS,
  port: ConfiguracionEntorno.puertoRDS,
  user: ConfiguracionEntorno.usuarioRDS,
  password: ConfiguracionEntorno.passUsuarioRDS,
  database: ConfiguracionEntorno.baseDatosRDS
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mysql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
