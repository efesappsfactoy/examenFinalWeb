import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EventoPorLibroEntity } from '../evento-por-libro/evento-por-libro.entity';


@Entity('evento')
export class EventoEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column(
    {
      name: 'nombre_evento',
      type: 'varchar',
      length: 40,
    },
  )
  nombre_evento?: string;

  @Column(
    {
      name: 'fecha_evento',
      type: 'varchar',
      length: 10,
    },
  )
  fecha_evento?: Date;

  @Column(
    {
      name: 'latitud_evento',
      type: 'decimal',
    },
  )
  latitud_evento?: number;

  @Column(
    {
      name: 'longitud_evento',
      type: 'decimal',
    },
  )
  longitud_evento?: number;

  @OneToMany(
    type => EventoPorLibroEntity,
    eventoPorLibro => eventoPorLibro.evento,
  )
  eventosPorLibro: EventoPorLibroEntity[];
}