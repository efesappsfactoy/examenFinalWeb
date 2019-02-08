import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { LibroEntity } from "src/libro/libro.entity";
import { UsuarioEntity } from "src/usuario/usuario.entity";

@Entity('autor')
export class AutorEntity{

  @PrimaryGeneratedColumn()
  id?: number;

  @Column(
    {
      name:'nombre_autor',
      type: 'varchar',
      length:40,
      default:'nombre',
    }
  )
  nombre_autor: string;

  @Column(
    {
      name:'apellido_autor',
      type: 'varchar',
      length:40,
      default:'apellido',
    }
  )
  apellido_autor: string;

  @Column(
    {
      name:'fecha_nacimiento',
      type: 'varchar',
      length:10,
      default:'1/1/1995'
    }
  )
  fecha_nacimiento?: Date;

  @Column(
    {
      name:'numero_libros',
      type: 'int',
    }
  )
  numero_libros?: number;

  @Column(
    {
      name:'ecuatoriano',
      type: 'boolean',
    }
  )
  es_ecuatoriano: boolean;

  @OneToMany(
    type => LibroEntity,
    libro => libro.autor
  )
  libros: LibroEntity[];

  @ManyToOne(
    type=>UsuarioEntity,
    usuario=>usuario.autores
  )
  usuario: UsuarioEntity;

}