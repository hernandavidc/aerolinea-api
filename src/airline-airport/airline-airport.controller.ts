import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { AirportEntity } from '../airport/entities/airport.entity';
import { AirlineEntity } from '../airline/entities/airline.entity';

@Controller('airlines/:airlineId/airports')
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(':airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number,
  ): Promise<AirlineEntity> {
    return await this.airlineAirportService.addAirportToAirline(
      airlineId,
      airportId,
    );
  }

  @Get()
  async findAirportsFromAirline(
    @Param('airlineId') airlineId: number,
  ): Promise<AirportEntity[]> {
    return await this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(':airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number,
  ): Promise<AirportEntity> {
    return await this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Put()
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: number,
    @Body() airportIds: number[],
  ): Promise<AirlineEntity> {
    return await this.airlineAirportService.updateAirportsFromAirline(
      airlineId,
      airportIds,
    );
  }

  @Delete(':airportId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number,
  ): Promise<void> {
    await this.airlineAirportService.deleteAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}
