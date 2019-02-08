import {Injectable} from "@nestjs/common";
import {FindManyOptions, Repository} from "typeorm";
import {EventoEntity} from "./evento.entity";
import {InjectRepository} from "@nestjs/typeorm";
import { EventoInterface } from './evento.interface';

@Injectable()
export class EventoService {
    constructor(
        @InjectRepository(EventoEntity)
        private readonly _eventoRepository: Repository<EventoEntity>){
    }

    buscar(parametros?: FindManyOptions<EventoEntity>): Promise<EventoEntity[]> {
        return this._eventoRepository.find(parametros)
    }

    async crear(evento: EventoInterface): Promise<EventoEntity> {
        const eventoEntity = this._eventoRepository.create(evento);
        return await this._eventoRepository.save(eventoEntity);
    }


    borrar(id: number): Promise<EventoEntity> {
        const eventoEntity = this._eventoRepository.create({
            id: id
        });
        return this._eventoRepository.remove(eventoEntity)
    }

    buscarPorId(id: number): Promise<EventoEntity> {
        return this._eventoRepository.findOne(id)
    }

    actualizar(evento: EventoInterface): Promise<EventoEntity> {
        const eventoEntity = this._eventoRepository.create(evento);
        return this._eventoRepository.save(eventoEntity)
    }

    obtenerEvento(): Promise<EventoEntity[]> {
        return this._eventoRepository.find()
    }

}