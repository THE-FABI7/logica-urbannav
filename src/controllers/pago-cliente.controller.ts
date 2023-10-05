import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Pago,
  Cliente,
} from '../models';
import {PagoRepository} from '../repositories';

export class PagoClienteController {
  constructor(
    @repository(PagoRepository)
    public pagoRepository: PagoRepository,
  ) { }

  @get('/pagos/{id}/cliente', {
    responses: {
      '200': {
        description: 'Cliente belonging to Pago',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cliente),
          },
        },
      },
    },
  })
  async getCliente(
    @param.path.number('id') id: typeof Pago.prototype.id,
  ): Promise<Cliente> {
    return this.pagoRepository.cliente(id);
  }
}
