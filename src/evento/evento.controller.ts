import { Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { EventoEntity } from './evento.entity';
import { FindManyOptions, Like } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { CreateEventoDto } from './dto/create-evento.dto';
import { EventoInterface } from './evento.interface';
import { EventoService } from './evento.service';

@Controller('eventos')
export class EventoController {

  constructor(private readonly _eventoService: EventoService) {
  }

  @Get('listar')
  async listarEventos(
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

      let evento: EventoEntity[];

      if (busqueda) {

        const consulta: FindManyOptions<EventoEntity> = {
          where: [
            {
              nombreEvento: Like(`%${busqueda}%`),
            },

          ],
        };
        evento = await this._eventoService.buscar(consulta);
      } else {
        evento = await this._eventoService.buscar();
      }
      response.render(
        'listar-eventos',
        {
          arregloEventos: evento,
          mensaje: mensaje,
        });
    } else {
      response.redirect('/login');
    }

  }

  @Get('crear')
  crearEvento(
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
        'crear-evento',
        {
          mensaje: mensaje,
        });
    } else {
      response.redirect('/login');
    }
  }

  @Post('crear')
  async crearEventoFuncion(
    @Res() response,
    @Body() evento: EventoInterface,
  ) {
    let mensaje = undefined;

    const objetoValidacionEvento = new CreateEventoDto();
    objetoValidacionEvento.nombre_evento = evento.nombre_evento;

    const fechaParaValidar = new Date(evento.fecha_evento).toISOString();
    objetoValidacionEvento.fecha_evento = fechaParaValidar;

    const errores: ValidationError[] =
      await validate(objetoValidacionEvento);

    let listaErrores = [];

    errores.forEach((error) => {
      listaErrores.push(error.constraints['matches']);
      listaErrores.push(error.constraints['isNotEmpty']);
      listaErrores.push(error.constraints['isDateString']);
    });
    const hayErrores = errores.length > 0;

    if (hayErrores) {
      console.error(errores);
      const parametrosConsulta = `?error=${listaErrores}`;
      response.redirect('/eventos/crear/' + parametrosConsulta);
    } else {
      await this._eventoService.crear(evento);
      const parametrosConsulta = `?accion=crear&nombre=${evento.nombre_evento}`;
      response.redirect('/eventos/listar' + parametrosConsulta);
    }
  }

  @Post('eliminar/:idEvento')
  async borrarEvento(
    @Param('idEvento') idEvento: string,
    @Res() response,
  ) {
    const evento = await this._eventoService
      .buscarPorId(+idEvento);
    await this._eventoService.borrar(+idEvento);
    const parametrosConsulta = `?accion=borrar&nombre=${evento.nombre_evento}`;
    response.redirect('/eventos/listar' + parametrosConsulta);
  }

  @Get('actualizar/:idEvento')
  async actualizarEvento(
    @Param('idEvento') idEvento: string,
    @Res() response,
    @Query('error') error: string,
    @Session() sesion,
  ) {

    if (sesion.rol === 'usuario') {

      let mensaje = undefined;

      if (error) {
        mensaje = error;
      }

      const eventoParaActualizar = await this._eventoService
        .buscarPorId(+idEvento);

      response.render(
        'crear-evento', {
          evento: eventoParaActualizar,
          mensaje: mensaje,
          idEvento: idEvento,
        },
      );
    } else {
      response.redirect('/login');
    }

  }

  @Post('actualizar/:idEvento')
  async actualizarEventoFuncion(
    @Param('idEvento') idEvento: string,
    @Res() response,
    @Body() evento: EventoInterface,
  ) {
    let mensaje = undefined;

    const objetoValidacionEvento = new CreateEventoDto();
    objetoValidacionEvento.nombre_evento = evento.nombre_evento;

    const fechaParaValidar = new Date(evento.fecha_evento).toISOString();
    objetoValidacionEvento.fecha_evento = fechaParaValidar;

    const errores: ValidationError[] =
      await validate(objetoValidacionEvento);

    let listaErrores = [];

    errores.forEach((error) => {
      listaErrores.push(error.constraints['matches']);
      listaErrores.push(error.constraints['isNotEmpty']);
      listaErrores.push(error.constraints['isDateString']);
    });
    const hayErrores = errores.length > 0;

    if (hayErrores) {
      console.error(errores);

      const parametrosConsulta = `?error=${listaErrores}`;

      response.redirect('/eventos/actualizar/' + idEvento + parametrosConsulta);
    } else {
      evento.id = +idEvento;

      await this._eventoService.actualizar(evento);
      const parametrosConsulta = `?accion=actualizar&nombre=${evento.nombre_evento}`;
      response.redirect('/eventos/listar' + parametrosConsulta);
    }
  }
}

