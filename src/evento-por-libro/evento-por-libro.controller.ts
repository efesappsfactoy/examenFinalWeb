import { Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { EventoPorLibroEntity } from './evento-por-libro.entity';
import { EventoEntity } from '../evento/evento.entity';
import { LibroService } from '../libro/libro.service';
import { EventoService } from '../evento/evento.service';
import { EventoPorLibroService } from './evento-por-libro.service';
import { EventoPorLibroInterface } from './evento-por-libro.interface';

@Controller('evento-por-libro')
export class EventoPorLibroController {
  constructor(private readonly _eventoPorLibroService: EventoPorLibroService,
              private readonly _libroService: LibroService,
              private readonly _eventoService: EventoService) {
  }

  @Get('emparejar/:idAutor/:idLibro')
  async emparejarLibroPorEvento(
    @Res() response,
    @Session() sesion,
    @Param('idAutor') idAutor,
    @Param('idLibro') idLibro,
    @Query('notificacion') notificacion
  ) {
    if (sesion.rol === 'usuario') {
      let mensajeEventoRepetido = undefined;
      let eventosPorLibro: EventoPorLibroEntity[];
      let eventos: EventoEntity[];

      /*
                  if (notificacion) {
                      mensajeEventoRepetido = `El evento ${notificacion} ya se encuentra asignado a este libro`

                  }
      */

      const libro = await this._libroService.buscarPorId(+idLibro);

      eventosPorLibro = await this._eventoPorLibroService.recuperarEvento(+idLibro);

      eventos = await this._eventoService.obtenerEvento();

      response.render('asignar-evento',
        {
          libro: libro,
          eventoPorLibro: eventosPorLibro,
          evento: eventos,
          mensaje: mensajeEventoRepetido,
          autor: idAutor
        });
    } else {
      response.redirect('/login');
    }
  }

  @Post('emparejar/:idAutor/:idLibro')
  async emparejarLibroPorEventoFuncion(
    @Res() response,
    @Param('idLibro') idLibro,
    @Param('idAutor') idAutor,
    @Body() eventoPorLibro: EventoPorLibroInterface
  ) {

    let eventosPorLibro: EventoPorLibroEntity;
    eventosPorLibro = await this._eventoPorLibroService.encontrarEvento(+idLibro, +eventoPorLibro.evento);

    if (eventosPorLibro) {
      const parametrosConsulta = `?notificacion=${eventosPorLibro.evento.nombre_evento}`;
      response.redirect('/evento-por-libro/emparejar/' + idAutor + '/' + idLibro + parametrosConsulta);
    } else {
      eventoPorLibro.libro = idLibro,
        await this._eventoPorLibroService.crearRegistro(eventoPorLibro);
      response.redirect('/evento-por-libro/emparejar/' + idAutor + '/' + idLibro);
    }
  }

  @Post('borrar/:idAutor/:idEventoPorLibro')
  async borrarEventoPorLibro(
    @Param('idEventoPorLibro') idEventoPorLibro,
    @Res() response,
    @Param('idAutor') idAutor
  ) {
    const eventoPorLibro = await this._eventoPorLibroService
      .buscarPorId(+idEventoPorLibro);
    await this._eventoPorLibroService.borrarEvento(+idEventoPorLibro);
    response.redirect('/evento-por-libro/emparejar/' + idAutor + '/' + eventoPorLibro.libro.id);
  }
}







