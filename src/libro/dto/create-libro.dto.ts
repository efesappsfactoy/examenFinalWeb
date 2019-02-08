import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateLibroDto {

  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsInt()
  icbn_libro?: number;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsString()
  @Matches(
    /^([a-z ñáéíóú]{2,60})$/i,
    {
      message: 'Este campo solo puede contener letras. por favor revise su entrada.',
    })
  nombre_libro?: string;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsInt({ message: 'Este campo puede ser llenado solo con numeros enteros.' })
  @Min(1)
  numero_paginas?: number;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsInt({ message: 'Este campo puede ser llenado solo con numeros enteros.' })
  @Min(1)
  edicion?: number;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsDateString({ message: 'La fecha puede a lo sumo puede ser la del día de hoy.' })
  fecha_publicacion?: Date;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsString()
  @Matches(
    /^([a-z ñáéíóú]{2,60})$/i,
    {
      message: 'Este campo solo puede contener letras. por favor revise su entrada.',
    })
  nombre_editorial?: string;
}