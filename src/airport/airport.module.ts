import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './entities/airport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class AirportModule {}
