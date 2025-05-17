import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirportEntity } from './entities/airport.entity';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirportEntity[]> {
    return await this.airportRepository.find({
      relations: ['aerolineas'],
    });
  }

  async findOne(id: number): Promise<AirportEntity> {
    const airport = await this.airportRepository.findOne({
      where: { id },
      relations: ['aerolineas'],
    });

    if (!airport) {
      throw new NotFoundException(`Aeropuerto con ID ${id} no encontrado`);
    }

    return airport;
  }

  async create(createAirportDto: CreateAirportDto): Promise<AirportEntity> {
    if (createAirportDto.codigo.length !== 3) {
      throw new BadRequestException(
        'El código del aeropuerto debe tener exactamente 3 caracteres',
      );
    }

    const airport = this.airportRepository.create(createAirportDto);
    return await this.airportRepository.save(airport);
  }

  async update(
    id: number,
    updateAirportDto: UpdateAirportDto,
  ): Promise<AirportEntity> {
    const airport = await this.findOne(id);

    if (updateAirportDto.codigo && updateAirportDto.codigo.length !== 3) {
      throw new BadRequestException(
        'El código del aeropuerto debe tener exactamente 3 caracteres',
      );
    }

    this.airportRepository.merge(airport, updateAirportDto);
    return await this.airportRepository.save(airport);
  }

  async delete(id: number): Promise<void> {
    const result = await this.airportRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Aeropuerto con ID ${id} no encontrado`);
    }
  }
}
