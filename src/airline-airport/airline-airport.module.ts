import { Module } from '@nestjs/common';
import { AirlineModule } from '../airline/airline.module';
import { AirportModule } from '../airport/airport.module';
import { AirlineAirportService } from './airline-airport.service';

@Module({
  imports: [AirlineModule, AirportModule],
  providers: [AirlineAirportService],
  controllers: [],
})
export class AirlineAirportModule {}
