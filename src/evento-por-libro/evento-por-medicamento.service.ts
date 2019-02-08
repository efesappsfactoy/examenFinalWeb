import {Injectable} from "@nestjs/common";
import {FindManyOptions, FindOneOptions, Repository} from "typeorm";
import {EventoPorLibroEntity} from "./evento-por-libro.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {RolPorUsuarioEntity} from "../rol-por-usuario/rol-por-usuario.entity";
import {RolEntity} from "../rol/rol.entity";
import {UsuarioEntity} from "../usuario/usuario.entity";
import {EventoEntity} from "../evento/evento.entity";
import {LibroEntity} from "../libro/libro.entity";

@Injectable()

export class EventoPorMedicamentoService {
    constructor(
        @InjectRepository(EventoPorLibroEntity)
        private readonly _eventoPorMedicamentoRepository: Repository<EventoPorLibroEntity>){

    }

    async verificarEvento(idMediacemento: number): Promise<EventoPorLibroEntity> {

        const consulta: FindOneOptions<EventoPorLibroEntity> = {
            where: {
                libro: idMediacemento,

            },
            relations:['libro','evento']
        };
        return await this._eventoPorMedicamentoRepository.findOne(consulta);
    }


    async encontrarEvento (idMedicamento:number, idEvento:number): Promise<EventoPorLibroEntity> {
        const consulta: FindOneOptions<EventoPorLibroEntity> = {
            where: {
                libro:idMedicamento,
                evento: idEvento,
            },
            relations:['evento','libro']
        };

        return await this._eventoPorMedicamentoRepository.findOne(consulta)

    }


    async obtenerEvento(idMedicamento: number): Promise<EventoPorLibroEntity[]> {

        const consulta: FindManyOptions<EventoPorLibroEntity> = {
            where: {
                libro: idMedicamento,
            },
            relations:['evento','libro']
        };
        return await this._eventoPorMedicamentoRepository.find(consulta);
    }

    async obtenerMedicamento(idEvento: number): Promise<EventoPorLibroEntity[]> {

        const consulta: FindManyOptions<EventoPorLibroEntity> = {
            where: {
                evento: idEvento,
            },
            relations:['libro']
        };
        return await this._eventoPorMedicamentoRepository.find(consulta);
    }


    async obtenerMedicamentoNombre(idEvento: number): Promise<EventoPorLibroEntity[]> {

        const consulta: FindOneOptions<EventoPorLibroEntity> = {
            where: {
                evento: idEvento,
            },
            relations:['evento']
        };
        return await this._eventoPorMedicamentoRepository.find(consulta);
    }


    borrar(id: number): Promise<EventoPorLibroEntity> {
        const eventoMedicamentoEntityEliminar = this._eventoPorMedicamentoRepository.create({
            id: id
        });
        return this._eventoPorMedicamentoRepository.remove(eventoMedicamentoEntityEliminar)
    }


    async buscarPorId(idEventoPorMedicamento: number): Promise<EventoPorLibroEntity> {

        const consulta: FindOneOptions<EventoPorLibroEntity> = {
            where: {
                id: idEventoPorMedicamento,

            },
            relations:['libro']
        };
        return await this._eventoPorMedicamentoRepository.findOne(consulta);
    }

    async crear(eventoPorMedicamento: EventoPorMedicamento): Promise<EventoPorLibroEntity>{

        const eventoPorMedicamentoEntity = this._eventoPorMedicamentoRepository.create(eventoPorMedicamento);
        const eventoPorMedicamentoCreado = await this._eventoPorMedicamentoRepository.save(eventoPorMedicamentoEntity);
        return eventoPorMedicamentoCreado;


    }

}

export interface EventoPorMedicamento{
    id?:number;
    medicamento:LibroEntity;
    evento:EventoEntity;

}
