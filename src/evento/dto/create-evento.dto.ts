import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateEventoDto {

  @IsOptional()
  id?: number;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsString()
  @Matches(
    /^([a-z ñáéíóú]{2,60})$/i,
    {
      message: 'Este campo solo puede contener letras. Por favor revise su entrada.',
    })
  nombre_evento: string;

  @IsNotEmpty({ message: 'Campo obligatorio, por favor llénelo.' })
  @IsDateString({ message: 'La fecha puede a lo sumo puede ser la del día de hoy.' })
  fecha_evento: string;

}