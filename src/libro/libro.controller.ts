import { Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { LibroService } from './libro.service';
import { FindManyOptions, Like } from 'typeorm';
import { LibroEntity } from './libro.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { validate, ValidationError } from 'class-validator';
import { LibroInterface } from './libro.interface';

@Controller('libros')
export class LibroController {

  constructor(private readonly _libroService: LibroService) {
  }

  @Get('listar/:idAutor')
  async listarLibros(
    @Res() response,
    @Query('accion') accion: string,
    @Query('nombre') nombre: string,
    @Query('nombre-libro') nombreLibro: string,
    @Param('idAutor') idAutor: string,
    @Session() sesion,
  ) {

    if (sesion.rol === 'usuario') {
      let mensaje = undefined;
      let clase = undefined;

      console.log(nombreLibro);


      if (accion && nombre) {
        switch (accion) {
          case 'crear':
            mensaje = `Registro ${nombre} creado`;
            clase = 'alert alert-success';
            break;
          case 'actualizar':
            mensaje = `Registro ${nombre} actualizado`;
            clase = 'alert alert-danger';
            break;
          case 'borrarLibro':
            mensaje = `Registro ${nombre} eliminado`;
            clase = 'alert alert-info';
            break;
        }
      }

      let libros: LibroEntity[];

      if (nombreLibro) {

        const consulta: FindManyOptions<LibroEntity> = {
          where: [
            {
              autor: idAutor,
              nombreLibro: Like(`%${nombreLibro}%`),
            },

          ],
        };
        libros = await this._libroService.buscar(consulta);
      } else {
        libros = await this._libroService.buscarLibroPorIdAutor(+idAutor);
      }

      response.render(
        'listar-libros',
        {
          arregloLibros: libros,
          idAutor: idAutor,
          mensaje: mensaje,
          clase: clase,
        },
      );
    } else {
      response.redirect('/login');
    }
  }

  @Get('crear/:idAutor')
  crearLibro(
    @Res() response,
    @Param('idAutor') idAutor: string,
    @Query('error') error: string,
    @Session() sesion,
  ) {
    if (sesion.rol === 'usuario') {
      let mensaje = undefined;

      if (error) {
        mensaje = error;
      }

      response.render(
        'crear-libro',
        {
          idAutor: idAutor,
          mensaje: mensaje,
        },
      );
    } else {
      response.redirect('/login');
    }
  }

  @Post('crear/:idAutor')
  async crearLibroFuncion(
    @Res() response,
    @Body() libro: LibroInterface,
    @Param('idAutor') idAutor: string,
  ) {

    let mensaje = undefined;
    let clase = undefined;

    const objetoValidacionLibro = new CreateLibroDto();

    objetoValidacionLibro.icbn_libro = libro.icbn_libro;
    objetoValidacionLibro.nombre_libro = libro.nombre_libro;
    objetoValidacionLibro.numero_paginas = libro.numero_paginas;
    objetoValidacionLibro.edicion = libro.edicion;
    objetoValidacionLibro.fecha_publicacion = libro.fecha_publicacion;
    objetoValidacionLibro.nombre_editorial = libro.nombre_editorial;

    const errores: ValidationError[] =
      await validate(objetoValidacionLibro);

    let listaErrores = [];

    errores.forEach((error) => {
      listaErrores.push(error.constraints['matches']);
      listaErrores.push(error.constraints['isNotEmpty']);
      listaErrores.push(error.constraints['isDateString']);
      listaErrores.push(error.constraints['isBoolean']);
      listaErrores.push(error.constraints['isNumber']);
    });

    const hayErrores = errores.length > 0;

    if (hayErrores) {
      console.error(errores);
      clase = 'alert alert-danger';
      const parametrosConsulta = `?error=${listaErrores}`;
      response.redirect(
        '/libros/crear/' + idAutor + parametrosConsulta,
        {
          clase: clase,
        });
    } else {
      await this._libroService.crear(libro);
      const parametrosConsulta = `?accion=crear&nombre=${libro.nombre_libro}`;
      response.redirect('/libros/listar/' + idAutor + parametrosConsulta);
    }
  }

  @Post('borrarLibro/:idAutor/:idLibro/')
  async borrarLibro(
    @Param('idLibro') idLibro: string,
    @Param('idAutor') idAutor: string,
    @Res() response,
  ) {
    const libro = await this._libroService.buscarPorId(+idLibro);
    await this._libroService.borrar(+idLibro);
    const parametrosConsulta = `?accion=borrar&nombre=${libro.nombre_libro}`;
    response.redirect('/libros/listar/' + idAutor + parametrosConsulta);
  }

  @Get('actualizar/:idAutor/:idLibro')
  async actualizarLibro(
    @Param('idLibro') idLibro: string,
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

      const libroParaActualizar = await this._libroService
        .buscarPorId(+idLibro);

      response.render(
        'crear-libro', {
          libro: libroParaActualizar,
          idAutor: idAutor,
          idLibro: idLibro,
          mensaje: mensaje,
        },
      );
    } else {
      response.redirect('/login');
    }
  }

  @Post('actualizar/:idAutor/:idLibro')
  async actualizarLibroFuncion(
    @Param('idLibro') idLibro: string,
    @Param('idAutor') idAutor: string,
    @Res() response,
    @Body() libro: LibroInterface,
  ) {


    let mensaje = undefined;
    let clase = undefined;

    const objetoValidacionLibro = new CreateLibroDto();

    objetoValidacionLibro.icbn_libro = libro.icbn_libro;
    objetoValidacionLibro.nombre_libro = libro.nombre_libro;
    objetoValidacionLibro.numero_paginas = libro.numero_paginas;
    objetoValidacionLibro.edicion = libro.edicion;
    objetoValidacionLibro.fecha_publicacion = libro.fecha_publicacion;
    objetoValidacionLibro.nombre_editorial = libro.nombre_editorial;

    const errores: ValidationError[] = await validate(objetoValidacionLibro);

    let listaErrores = [];

    errores.forEach((error) => {
      listaErrores.push(error.constraints['matches']);
      listaErrores.push(error.constraints['isNotEmpty']);
      listaErrores.push(error.constraints['isDateString']);
      listaErrores.push(error.constraints['isBoolean']);
      listaErrores.push(error.constraints['isNumber']);
    });

    const hayErrores = errores.length > 0;

    if (hayErrores) {
      console.error(errores);
      const parametrosConsulta = `?error=${listaErrores}`;
      response.redirect('/libros/actualizar/' + idAutor + '/' + idLibro + parametrosConsulta);
    } else {
      libro.id = +idLibro;
      await this._libroService.actualizar(+idLibro, libro);
      const parametrosConsulta = `?accion=actualizar&nombre=${libro.nombre_libro}`;
      response.redirect('/libros/listar/' + idAutor + parametrosConsulta);
    }
  }
}

