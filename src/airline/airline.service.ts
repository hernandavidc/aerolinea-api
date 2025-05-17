import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineEntity } from './entities/airline.entity';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find({
      relations: ['aeropuertos'],
    });
  }

  async findOne(id: number): Promise<AirlineEntity> {
    const airline = await this.airlineRepository.findOne({
      where: { id },
      relations: ['aeropuertos'],
    });

    if (!airline) {
      throw new NotFoundException(`Aerolinea con ID ${id} no encontrada`);
    }

    return airline;
  }

  async create(createAirlineDto: CreateAirlineDto): Promise<AirlineEntity> {
    const foundationDate = new Date(createAirlineDto.fechaFundacion);
    const currentDate = new Date();

    if (foundationDate > currentDate) {
      throw new BadRequestException(
        'La fecha de la fundación debe ser anterior',
      );
    }

    const airline = this.airlineRepository.create(createAirlineDto);
    return await this.airlineRepository.save(airline);
  }

  async update(
    id: number,
    updateAirlineDto: UpdateAirlineDto,
  ): Promise<AirlineEntity> {
    const airline = await this.findOne(id);

    if (updateAirlineDto.fechaFundacion) {
      const foundationDate = new Date(updateAirlineDto.fechaFundacion);
      const currentDate = new Date();

      if (foundationDate > currentDate) {
        throw new BadRequestException(
          'La fecha de la fundación debe ser anterior',
        );
      }
    }

    this.airlineRepository.merge(airline, updateAirlineDto);
    return await this.airlineRepository.save(airline);
  }

  async delete(id: number): Promise<void> {
    const result = await this.airlineRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Aerolínea con ID ${id} no encontrada`);
    }
  }
}
