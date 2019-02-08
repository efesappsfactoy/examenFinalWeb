import { IsNotEmpty, IsString, IsOptional, IsDateString, Min, IsInt, Matches, IsBoolean } from 'class-validator';

export class CreateAutorDto {

  @IsOptional()
  id?: number;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsString()
  @Matches(
    /^([a-z ñáéíóú]{2,60})$/i,
    {
      message: 'Este campo solo puede contener letras. Por favor revise su entrada.',
    })
  nombre_autor?: string;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsString()
  @Matches(
    /^([a-z ñáéíóú]{2,60})$/i,
    {
      message: 'Este campo solo puede contener letras. por favor revise su entrada.',
    })
  apellido_autor ?: string;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsDateString({ message: 'La fecha puede a lo sumo puede ser la del día de hoy.' })
  fecha_nacimiento ?: string;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsInt({ message: 'Este campo puede ser llenado solo con numeros enteros.' })
  @Min(1)
  numero_libros ?: number;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsBoolean()
  ecuatoriano ?: boolean;

}