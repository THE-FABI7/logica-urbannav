import {inject} from '@loopback/core';
import {
  get, HttpErrors,
  oas,
  param,
  post, Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {promisify} from 'util';
import {ConfiguracionGeneral} from '../config/configuracion.general';

import fs from 'fs';
const readdir = promisify(fs.readdir);

export class AdministradorDeArchivosController {
  constructor() { }

  @post('/cargar-archivo-automovil', {
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Archivo a cargar',
      },
    },
  })

  async CargarArchivoAutomovil(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const FilePath = path.join(__dirname, ConfiguracionGeneral.carpetaArchivosAutomoviles);
    let res = await this.StoreFileToPath(
      FilePath,
      ConfiguracionGeneral.campoDeAutomoviles,
      request,
      response,
      ConfiguracionGeneral.extensionesImagenes
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        return {file: filename};
      }
    }
    return res;
  }
  @post('/cargar-archivo-cliente', {
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Archivo a cargar',
      },
    },
  })
  async CargarArchivoCliente(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const FilePath = path.join(__dirname, ConfiguracionGeneral.carpetaArchivosAutomoviles);
    let res = await this.StoreFileToPath(
      FilePath,
      ConfiguracionGeneral.campoDeClientes,
      request,
      response,
      ConfiguracionGeneral.extensionesImagenes
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        return {file: filename};
      }
    }
    return res;
  }

  @post('/cargar-archivo-conductor', {
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Archivo a cargar',
      },
    },
  })
  async CargarArchivoConductor(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const FilePath = path.join(__dirname, ConfiguracionGeneral.carpetaArchivosConductores);
    let res = await this.StoreFileToPath(
      FilePath,
      ConfiguracionGeneral.campoDeConductores,
      request,
      response,
      ConfiguracionGeneral.extensionesImagenes
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        return {file: filename};
      }
    }
    return res;
  }

  private GetMulterStorage(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path);
      },
      filename: function (req, file, cb) {
        filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    });
    return storage;
  }

  private StoreFileToPath(
    storePath: string,
    fieldName: string,
    request: Request,
    response: Response,
    acceptedExt: string[],
  ): Promise<object> {

    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorage(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          var ext = path.extname(file.originalname).toUpperCase();
          console.log(ext);
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(
            new HttpErrors[400]('la extension del archivo no es admitida para su almacenamiento.'),
          );
        },
        limits: {},
      }).single(fieldName);
      upload(request, response, (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  /** Descaragar archivos */

  @get('/archivos/{type}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string'
              },
            },
          },
        },
        description: 'Una lista de archivos',
      },
    },
  })
  async ObtenerListaDeArchivos(@param.path.number('type') type: number) {
    const folderPath = this.ObtenerArchivosPorTipo(type);
    const files = await readdir(folderPath);
    return files;
  }

  @get('/ObtenerArchivo/{type}/{name}')
  @oas.response.file()
  async downloadFileByName(
    @param.path.number('type') type: number,
    @param.path.string('name') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const folder = this.ObtenerArchivosPorTipo(type);
    const file = this.ValidarNombreDeArchivo(folder, fileName);
    response.download(file, fileName);
    return response;
  }

  private ObtenerArchivosPorTipo(tipo: number) {
    let filePath = '';
    switch (tipo) {
      case 1:
        filePath = path.join(__dirname, ConfiguracionGeneral.carpetaArchivosConductores);
        break;
      case 2:
        filePath = path.join(__dirname, ConfiguracionGeneral.carpetaArchivosClientes);
        break;
      case 3:
        filePath = path.join(__dirname, ConfiguracionGeneral.carpetaArchivosAutomoviles);
        break;
    }
    return filePath;
  }

  private ValidarNombreDeArchivo(folder: string, fileName: string) {
    const resolved = path.resolve(folder, fileName);
    if (resolved.startsWith(folder)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors[400](`Este archivo es invalido : ${fileName}`);
  }
}
