import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, Repository} from "typeorm";
import {RolEntity} from "./rol.entity";
import {UsuarioEntity} from "../usuario/usuario.entity";
import {AutorEntity} from "../autor/autor.entity";

Injectable()

export class RolService {

    constructor(
        @InjectRepository(RolEntity)
        private readonly _rolRepository: Repository<RolEntity>
    ){

    }


    obtenerRol(): Promise<RolEntity[]> {
        return this._rolRepository.find()
    }

}



