import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LibroEntity} from "./libro.entity";
import {LibroController} from "./libro.controller";
import {LibroService} from "./libro.service";

@Module(
    {
        imports:[TypeOrmModule.forFeature([LibroEntity])],
        controllers:[ LibroController],
        providers:[LibroService],
        exports:[LibroService]

    }
)

export class LibroModule{

}