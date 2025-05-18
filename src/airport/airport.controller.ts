import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AirportService } from './airport.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { AirportEntity } from './entities/airport.entity';

@Controller('airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  async findAll(): Promise<AirportEntity[]> {
    return await this.airportService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AirportEntity> {
    return await this.airportService.findOne(id);
  }

  @Post()
  async create(
    @Body() createAirportDto: CreateAirportDto,
  ): Promise<AirportEntity> {
    return await this.airportService.create(createAirportDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAirportDto: UpdateAirportDto,
  ): Promise<AirportEntity> {
    return await this.airportService.update(id, updateAirportDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.airportService.delete(id);
  }
}
