import { Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { AutorService } from './autor.service';
import { AutorEntity } from './autor.entity';
import { FindManyOptions, Like } from 'typeorm';
import { CreateAutorDto } from './dto/create-autor.dto';
import { validate, ValidationError } from 'class-validator';
import { AutorInterface } from './autor.interface';

@Controller('autores')
export class AutorController {

  constructor(private readonly _autorService: AutorService) {
  }

  @Get('listar')
  async listarAutores(
    @Res() response,
    @Query('accion') accion: string,
    @Query('nombre') nombre: string,
    @Query('busqueda') busqueda: string,
    @Session() sesion,
  ) {
    if (sesion.rol === 'usuario') {
      let mensaje = undefined;
      console.log(sesion);

      if (accion && nombre) {
        switch (accion) {
          case 'crear':
            mensaje = `Registro ${nombre} creado`;
            break;
          case 'actualizar':
            mensaje = `Registro ${nombre} actualizado`;
            break;
          case 'borrar':
            mensaje = `Registro ${nombre} eliminado`;
            break;
        }
      }

      let autor: AutorEntity[];

      if (busqueda) {
        const consulta: FindManyOptions<AutorEntity> = {
          where: [
            {
              usuario: sesion.idUsuario,
              nombres: Like(`%${busqueda}%`),
            },
            {
              usuario: sesion.idUsuario,
              apellidos: Like(`%${busqueda}%`),
            },
            {
              usuario: sesion.idUsuario,
              fechaNacimiento: Like(`%${busqueda}%`),
            },

          ],
        };

        autor = await this._autorService.buscar(consulta);
      } else {
        const consulta: FindManyOptions<AutorEntity> = {
          where: [{ usuario: sesion.idUsuario }],
        };
        autor = await this._autorService.buscar(consulta);
      }

      response.render(
        'listar-autores',
        {
          arregloAutores: autor,
          mensaje: mensaje,
        });
    } else {
      response.redirect('/login');
    }
  }

  @Get('crear')
  crearAutor(
    @Res() response,
    @Session() sesion,
    @Query('error') error: string,
  ) {

    if (sesion.rol === 'usuario') {

      let mensaje = undefined;

      if (error) {
        mensaje = error;
      }
      response.render(
        'crearRegistro-autor',
        {
          mensaje: mensaje
        });
    } else {
      response.redirect('/login');
    }
  }

  @Post('crear')
  async crearAutorFuncion(
    @Res() response,
    @Body() autor: AutorInterface,
    @Session() sesion,
  ) {

    const objetoValidacionAutor = new CreateAutorDto();

    objetoValidacionAutor.nombre_autor = autor.nombre_autor;
    objetoValidacionAutor.apellido_autor = autor.apellido_autor;
    objetoValidacionAutor.numero_libros = autor.numero_libros;
    objetoValidacionAutor.ecuatoriano = autor.es_ecuatoriano;
    const fechaParaValidar = new Date(autor.fecha_nacimiento).toISOString();
    objetoValidacionAutor.fecha_nacimiento = fechaParaValidar;

    const errores: ValidationError[] = await validate(objetoValidacionAutor);

    let listaErrores = [];

    errores.forEach((error) => {
      listaErrores.push(error.constraints['matches']);
      listaErrores.push(error.constraints['isNotEmpty']);
      listaErrores.push(error.constraints['isDateString']);
      listaErrores.push(error.constraints['isInt']);
      listaErrores.push(error.constraints['isBoolean']);
    });

    const hayErrores = errores.length > 0;

    if (hayErrores) {
      console.error(errores);
      const parametrosConsulta = `?error=${listaErrores}`;
      response.redirect('/autores/crearRegistro/' + parametrosConsulta);
    } else {
      autor.usuario = sesion.idUsuario;
      await this._autorService.crear(autor);
      const parametrosConsulta = `?accion=crear&nombre=${autor.nombre_autor}`;
      response.redirect('/autores/listar' + parametrosConsulta);
    }
  }


  @Post('borrar/:idAutor')
  async borrarAutor(
    @Param('idAutor') idAutor: string,
    @Res() response,
  ) {
    const autorParaBorrar = await this._autorService
      .buscarPorId(+idAutor);

    await this._autorService.borrar(+idAutor);

    const parametrosConsulta = `?accion=borrar&nombre=${autorParaBorrar.nombre_autor}`;

    response.redirect('/autores/listar' + parametrosConsulta);
  }

  @Get('actualizar/:idAutor')
  async actualizarAutor(
    @Param('idAutor') idAutor: string,
    @Res() response,
    @Query('error') error: string,
    @Session() sesion,
  ) {
    if (sesion.rol === 'usuario') {

      let mensaje = undefined;

      if (error) {
        mensaje = error;
      }

      const autorParaActualizar = await this._autorService
        .buscarPorId(+idAutor);

      response.render(
        'crearRegistro-autor', {
          autor: autorParaActualizar,
          mensaje: mensaje,
        },
      );
    } else {
      response.redirect('/login');
    }
  }

  @Post('actualizar/:idAutor')
  async actualizarAutorFuncion(
    @Param('idAutor') idAutor: string,
    @Res() response,
    @Body() autor: AutorInterface,
  ) {

    const objetoValidacionAutor = new CreateAutorDto();

    objetoValidacionAutor.nombre_autor = autor.nombre_autor;
    objetoValidacionAutor.apellido_autor = autor.apellido_autor;
    objetoValidacionAutor.numero_libros = autor.numero_libros;
    objetoValidacionAutor.ecuatoriano = autor.es_ecuatoriano;
    const fechaParaValidar = new Date(autor.fecha_nacimiento).toISOString();
    objetoValidacionAutor.fecha_nacimiento = fechaParaValidar;

    const errores: ValidationError[] = await validate(objetoValidacionAutor);

    let listaErrores = [];

    errores.forEach(error => {
      listaErrores.push(error.constraints['matches']);
      listaErrores.push(error.constraints['isNotEmpty']);
      listaErrores.push(error.constraints['isDateString']);
      listaErrores.push(error.constraints['isInt']);
      listaErrores.push(error.constraints['isBoolean']);
    });

    const hayErrores = errores.length > 0;

    if (hayErrores) {
      console.error(errores);
      const parametrosConsulta = `?error=${listaErrores}`;
      response.redirect('/autores/actualizar/' + idAutor + parametrosConsulta);
    } else {
      autor.id = +idAutor;
      await this._autorService.actualizar(+idAutor, autor);
      const parametrosConsulta = `?accion=actualizar&nombre=${autor.nombre_autor}`;
      response.redirect('/autores/listar' + parametrosConsulta);
    }
  }
}

