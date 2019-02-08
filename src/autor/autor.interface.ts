import { UsuarioEntity } from '../usuario/usuario.entity';

export interface AutorInterface {
  id?: number;
  nombre_autor: string;
  apellido_autor: string;
  fecha_nacimiento?: Date;
  numero_libros?: number;
  es_ecuatoriano: boolean;
  usuario: UsuarioEntity;
}