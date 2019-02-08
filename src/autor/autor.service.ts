import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { AutorEntity } from './autor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AutorInterface } from './autor.interface';

@Injectable()
export class AutorService {
  constructor(
    @InjectRepository(AutorEntity)
    private readonly _autorRepository: Repository<AutorEntity>) {

  }

  buscar(parametros?: FindManyOptions<AutorEntity>): Promise<AutorEntity[]> {
    return this._autorRepository.find(parametros);
  }

  async crear(autor: AutorInterface): Promise<AutorEntity> {
    const autorEntity = this._autorRepository.create(autor);
    return await this._autorRepository.save(autorEntity);
  }

  actualizar(id: number, autor: AutorInterface): Promise<AutorEntity> {
    autor.id = id;
    const autorEntity = this._autorRepository.create(autor);
    return this._autorRepository.save(autorEntity);
  }

  borrar(id: number): Promise<AutorEntity> {
    const autorEntity = this._autorRepository.create({
      id: id,
    });
    return this._autorRepository.remove(autorEntity);
  }

  buscarPorId(id: number): Promise<AutorEntity> {
    return this._autorRepository.findOne(id);
  }
}
