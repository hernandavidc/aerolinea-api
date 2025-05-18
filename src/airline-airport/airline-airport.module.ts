import { Module } from '@nestjs/common';
import { AirlineModule } from '../airline/airline.module';
import { AirportModule } from '../airport/airport.module';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineAirportController } from './airline-airport.controller';

@Module({
  imports: [AirlineModule, AirportModule],
  providers: [AirlineAirportService],
  controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
