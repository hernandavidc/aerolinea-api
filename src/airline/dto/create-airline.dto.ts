import { IsDate, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateAirlineDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDate()
  @IsNotEmpty()
  fechaFundacion: Date;

  @IsUrl()
  @IsNotEmpty()
  website: string;
}
