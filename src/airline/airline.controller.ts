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
import { AirlineService } from './airline.service';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { AirlineEntity } from './entities/airline.entity';

@Controller('airlines')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AirlineEntity> {
    return await this.airlineService.findOne(id);
  }

  @Post()
  async create(
    @Body() createAirlineDto: CreateAirlineDto,
  ): Promise<AirlineEntity> {
    return await this.airlineService.create(createAirlineDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAirlineDto: UpdateAirlineDto,
  ): Promise<AirlineEntity> {
    return await this.airlineService.update(id, updateAirlineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.airlineService.delete(id);
  }
}
