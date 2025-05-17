import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAirportDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;
}
