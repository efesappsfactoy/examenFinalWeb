import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RolEntity} from "./rol/rol.entity";
import {UsuarioEntity} from "./usuario/usuario.entity";
import {LibroEntity} from "./libro/libro.entity";
import {AutorEntity} from "./autor/autor.entity";
import {RolPorUsuarioEntity} from "./rol-por-usuario/rol-por-usuario.entity";
import {EventoEntity} from "./evento/evento.entity";
import {EventoPorLibroEntity} from "./evento-por-libro/evento-por-libro.entity";
import {LibroModule} from "./libro/libro.module";
import {AutorModule} from "./autor/autor.module";
import {RolPorUsuarioModule} from "./rol-por-usuario/rol-por-usuario.module";
import {UsuarioModule} from "./usuario/usuario.module";
import {EventoModule} from "./evento/evento.module";
import {EventoPorMedicamentoModule} from "./evento-por-libro/evento-por-medicamento.module";
import {RolModule} from "./rol/rol.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 32769,
      username: 'miguel',
      password: '182025',
      database: 'examenWeb',
      // BDD Ya existe -> synchronized: false
      synchronize: true,
      dropSchema: false
        , //borra la base y se vuelve a crear, buena idea para pruebas pero no para produccion
      entities: [
        RolEntity, UsuarioEntity, LibroEntity, AutorEntity, RolPorUsuarioEntity, EventoEntity, EventoPorLibroEntity
      ],
    }),
    EventoModule,
    UsuarioModule,
    EventoPorMedicamentoModule,
    AutorModule,
    LibroModule,
    RolPorUsuarioModule,
    RolModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
