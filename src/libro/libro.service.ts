import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { LibroEntity } from './libro.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LibroInterface } from './libro.interface';

@Injectable()
export class LibroService {

  constructor(
    @InjectRepository(LibroEntity)
    private readonly _libroRepository: Repository<LibroEntity>) {

  }

  buscar(parametros?: FindManyOptions<LibroEntity>): Promise<LibroEntity[]> {
    return this._libroRepository.find(parametros);
  }

  async crear(libro: LibroInterface): Promise<LibroEntity> {
    const libroEntity = this._libroRepository.create(libro);
    return await this._libroRepository.save(libroEntity);;
  }

  actualizar(id: number, libro: LibroInterface): Promise<LibroEntity> {
    libro.id = id;
    const libroEntity = this._libroRepository.create(libro);
    return this._libroRepository.save(libroEntity);
  }

  borrar(id: number): Promise<LibroEntity> {
    const libroEntity = this._libroRepository.create({
      id: id,
    });
    return this._libroRepository.remove(libroEntity);
  }

  buscarPorId(id: number): Promise<LibroEntity> {
    return this._libroRepository.findOne(id);
  }

  async buscarLibroPorIdAutor(idAutor: number): Promise<LibroEntity[]> {
    const librosConsulta: FindManyOptions<LibroEntity> =
      {
        where: {
          autor: idAutor,
        },
      };
    return await this._libroRepository.find(librosConsulta);
  }


}