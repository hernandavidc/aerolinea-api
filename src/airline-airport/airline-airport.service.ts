/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AirlineService } from '../airline/airline.service';
import { AirportService } from '../airport/airport.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineEntity } from '../airline/entities/airline.entity';
import { AirportEntity } from '../airport/entities/airport.entity';

@Injectable()
export class AirlineAirportService {
  constructor(
    private readonly airlineService: AirlineService,
    private readonly airportService: AirportService,
    @InjectRepository(AirlineEntity)
    private airlineRepository: Repository<AirlineEntity>,
  ) {}

  async addAirportToAirline(
    airlineId: number,
    airportId: number,
  ): Promise<AirlineEntity> {
    const airline = await this.airlineService.findOne(airlineId);
    const airport = await this.airportService.findOne(airportId);

    if (!airline.aeropuertos) {
      airline.aeropuertos = [];
    }

    const airportExists = airline.aeropuertos.find((a) => a.id === airportId);
    if (airportExists) {
      throw new BadRequestException(
        `El aeropuerto con ID ${airportId} ya está asociado a esta línea aérea.`,
      );
    }

    airline.aeropuertos.push(airport);
    return await this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: number): Promise<AirportEntity[]> {
    const airline = await this.airlineService.findOne(airlineId);
    return airline.aeropuertos;
  }

  async findAirportFromAirline(
    airlineId: number,
    airportId: number,
  ): Promise<AirportEntity> {
    const airline = await this.airlineService.findOne(airlineId);

    const airport = airline.aeropuertos.find((a) => a.id === airportId);
    if (!airport) {
      throw new NotFoundException(
        `Aeropuerto con ID ${airportId} no encontrado en aerolínea con ID ${airlineId}`,
      );
    }

    return airport;
  }

  async updateAirportsFromAirline(
    airlineId: number,
    airportIds: number[],
  ): Promise<AirlineEntity> {
    const airline = await this.airlineService.findOne(airlineId);

    const aeropuertos: AirportEntity[] = [];
    for (const id of airportIds) {
      try {
        const airport = await this.airportService.findOne(id);
        aeropuertos.push(airport);
      } catch (error) {
        throw new NotFoundException(`Aeropuerto con ID ${id} no encontrado`);
      }
    }

    airline.aeropuertos = aeropuertos;
    return await this.airlineRepository.save(airline);
  }

  async deleteAirportFromAirline(
    airlineId: number,
    airportId: number,
  ): Promise<AirlineEntity> {
    const airline = await this.airlineService.findOne(airlineId);

    const airportIndex = airline.aeropuertos.findIndex(
      (a) => a.id === airportId,
    );
    if (airportIndex === -1) {
      throw new NotFoundException(
        `Aeropuerto con ID ${airportId} no encontrado en aerolínea con ID ${airlineId}`,
      );
    }

    airline.aeropuertos.splice(airportIndex, 1);
    return await this.airlineRepository.save(airline);
  }
}
