import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './entities/airline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class AirlineModule {}
