import {Body, Controller, Get, Param, Post, Query, Res, Session} from "@nestjs/common";
import {EventoPorMedicamento, EventoPorMedicamentoService} from "./evento-por-medicamento.service";
import {EventoPorLibroEntity} from "./evento-por-libro.entity";
import {EventoEntity} from "../evento/evento.entity";
import {LibroService} from "../libro/libro.service";
import {EventoService} from "../evento/evento.service";

@Controller('evento-por-libro')

export class EventoPorMedicamentoController {
    constructor(private readonly _eventoPorMedicamentoService: EventoPorMedicamentoService,
                private readonly _medicamentoService: LibroService,
                private readonly _eventoService: EventoService) {

    }


    @Get('asignar-evento/:idPaciente/:idMedicamento')
    async mostrarAsiganarEvento(
        @Res() response,
        @Session() sesion,
        @Param('idPaciente') idPaciente,
        @Param('idMedicamento') idMedicamento,
        @Query('notificacion') notificacion
    ){
        if(sesion.rol==='usuario') {
            let mensajeEventoRepetido = undefined
            let medicamentoEventos: EventoPorLibroEntity[];
            let eventos: EventoEntity[];

            if (notificacion) {
                mensajeEventoRepetido = `El evento ${notificacion} ya se encuentra asignado a este medicamento`

            }

            const medicamento = await this._medicamentoService.buscarPorId(+idMedicamento)

            medicamentoEventos = await this._eventoPorMedicamentoService.obtenerEvento(+idMedicamento)

            eventos = await this._eventoService.obtenerEvento()

            response.render('asignar-evento',
                {
                    libro: medicamento,
                    eventoMedicamento: medicamentoEventos,
                    evento: eventos,
                    mensajeEvento: mensajeEventoRepetido,
                    autor:idPaciente
                })
        }else{
            response.redirect('/login')
        }
    }



    @Post('borrarAutor/:idPaciente/:idEventoPorMedicamento')
    async borrar(
        @Param('idEventoPorMedicamento') idEventoPorMedicamento,
        @Res() response,
        @Param('idPaciente') idPaciente
    ) {
        const eventoPorMedicamentoEncontrado = await this._eventoPorMedicamentoService
            .buscarPorId(+idEventoPorMedicamento);
        //console.log("sddddddddddddddddddddddddddddddddddddd"+ stringify(rolUsuarioEncontrado))

        await this._eventoPorMedicamentoService.borrar(Number(idEventoPorMedicamento));

        const parametrosConsulta = `?accion=borrar&nombre=${eventoPorMedicamentoEncontrado.id}`;

        response.redirect('/evento-por-libro/asignar-evento/'+idPaciente+'/'+eventoPorMedicamentoEncontrado.libro.id);
    }


    @Post('asignar-evento/:idPaciente/:idMedicamento')
    async metodoAsignarRol(
        @Res() response,
        @Param('idMedicamento') idMedicamento,
        @Param('idPaciente') idPaciente,
        @Body() eventoPorMedicamento:EventoPorMedicamento,
    ){

        let medicamentoEventos: EventoPorLibroEntity;
        medicamentoEventos = await this._eventoPorMedicamentoService.encontrarEvento(+idMedicamento, +eventoPorMedicamento.evento)

        if(medicamentoEventos){
            const parametrosConsulta = `?notificacion=${medicamentoEventos.evento.nombreEvento}`;
            response.redirect('/evento-por-libro/asignar-evento/'+idPaciente+'/'+idMedicamento+parametrosConsulta)
        }else{

            eventoPorMedicamento.medicamento = idMedicamento,
                await this._eventoPorMedicamentoService.crear(eventoPorMedicamento)
            //const parametrosConsulta = `?accion=crear&nombre=${rolPorUsuario.rol}`;
            response.redirect('/evento-por-libro/asignar-evento/'+idPaciente+'/'+idMedicamento)
        }}



}







