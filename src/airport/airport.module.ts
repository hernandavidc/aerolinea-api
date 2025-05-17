import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './entities/airport.entity';
import { AirportService } from './airport.service';

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  providers: [AirportService],
  controllers: [],
  exports: [AirportService],
})
export class AirportModule {}
