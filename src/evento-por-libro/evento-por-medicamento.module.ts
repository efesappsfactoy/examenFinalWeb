import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm"
import {EventoPorLibroEntity} from "./evento-por-libro.entity";
import {EventoPorMedicamentoController} from "./evento-por-medicamento.controller";
import {EventoPorMedicamentoService} from "./evento-por-medicamento.service";
import {EventoModule} from "../evento/evento.module";
import {LibroModule} from "../libro/libro.module";

@Module(
    {
        imports:[ TypeOrmModule.forFeature([EventoPorLibroEntity]),EventoModule,LibroModule ],
        controllers:[EventoPorMedicamentoController],
        providers:[EventoPorMedicamentoService],
        exports:[EventoPorMedicamentoService]

    }
)

export class EventoPorMedicamentoModule{

}