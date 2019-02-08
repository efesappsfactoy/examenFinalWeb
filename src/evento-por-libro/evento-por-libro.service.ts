import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventoPorLibroEntity } from './evento-por-libro.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventoPorLibroInterface } from './evento-por-libro.interface';

@Injectable()

export class EventoPorLibroService {
  constructor(
    @InjectRepository(EventoPorLibroEntity)
    private readonly _eventoPorLibroRepository: Repository<EventoPorLibroEntity>) {

  }

  async crear(eventoPorLibro: EventoPorLibroInterface): Promise<EventoPorLibroEntity> {
    const eventoPorLibroEntity = this._eventoPorLibroRepository.create(eventoPorLibro);
    return await this._eventoPorLibroRepository.save(eventoPorLibroEntity);
  }

  async encontrarEvento(idLibro: number, idEvento: number): Promise<EventoPorLibroEntity> {
    const consulta: FindOneOptions<EventoPorLibroEntity> = {
      where: {
        libro: idLibro,
        evento: idEvento
      },
      relations: ['evento', 'libro']
    };

    return await this._eventoPorLibroRepository.findOne(consulta);
  }

  async recuperarEvento(idLibro: number): Promise<EventoPorLibroEntity[]> {
    const consulta: FindManyOptions<EventoPorLibroEntity> = {
      where: {
        libro: idLibro
      },
      relations: ['evento', 'libro']
    };
    return await this._eventoPorLibroRepository.find(consulta);
  }

  async recuperarLibro(idEvento: number): Promise<EventoPorLibroEntity[]> {
    const consulta: FindManyOptions<EventoPorLibroEntity> = {
      where: {
        evento: idEvento
      },
      relations: ['libro']
    };
    return await this._eventoPorLibroRepository.find(consulta);
  }

  borrarEvento(id: number): Promise<EventoPorLibroEntity> {
    const eventoPorLibroEntity = this._eventoPorLibroRepository.create({
      id: id
    });
    return this._eventoPorLibroRepository.remove(eventoPorLibroEntity);
  }

  async buscarPorId(idEventoPorLibro: number): Promise<EventoPorLibroEntity> {
    const consulta: FindOneOptions<EventoPorLibroEntity> = {
      where: {
        id: idEventoPorLibro

      },
      relations: ['libro']
    };
    return await this._eventoPorLibroRepository.findOne(consulta);
  }
}
