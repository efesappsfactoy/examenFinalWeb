import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm"
import {EventoPorLibroEntity} from "./evento-por-libro.entity";
import {EventoPorLibroController} from "./evento-por-libro.controller";
import {EventoPorLibroService} from "./evento-por-libro.service";
import {EventoModule} from "../evento/evento.module";
import {LibroModule} from "../libro/libro.module";

@Module(
    {
        imports:[ TypeOrmModule.forFeature([EventoPorLibroEntity]),EventoModule,LibroModule ],
        controllers:[EventoPorLibroController],
        providers:[EventoPorLibroService],
        exports:[EventoPorLibroService]

    }
)

export class EventoPorLibroModule{

}