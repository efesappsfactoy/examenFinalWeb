import { LibroEntity } from '../libro/libro.entity';
import { EventoEntity } from '../evento/evento.entity';

export interface EventoPorLibroInterface{
  id?: number;
  libro: LibroEntity;
  evento: EventoEntity;
}