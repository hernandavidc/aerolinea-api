import { Module } from '@nestjs/common';
import { AirlineModule } from '../airline/airline.module';
import { AirportModule } from '../airport/airport.module';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineAirportController } from './airline-airport.controller';
import { AirlineEntity } from '../airline/entities/airline.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirlineEntity]),
    AirlineModule,
    AirportModule,
  ],
  providers: [AirlineAirportService],
  controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
