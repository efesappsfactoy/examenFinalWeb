import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorEntity } from './autor.entity';
import { AutorService } from './autor.service';
import { EventoModule } from '../evento/evento.module';
import { AutorController } from './autor.controller';

@Module(
  {
    imports: [TypeOrmModule.forFeature([AutorEntity]), EventoModule],
    controllers: [AutorController],
    providers: [AutorService],
    exports: [AutorService],

  },
)
export class AutorModule {

}