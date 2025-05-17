import { Module } from '@nestjs/common';
import { AirlineModule } from '../airline/airline.module';
import { AirportModule } from '../airport/airport.module';

@Module({
  imports: [AirlineModule, AirportModule],
  providers: [],
  controllers: [],
})
export class AirlineAirportModule {}
