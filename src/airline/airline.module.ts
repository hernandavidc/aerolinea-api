import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './entities/airline.entity';
import { AirlineService } from './airline.service';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  providers: [AirlineService],
  controllers: [],
  exports: [AirlineService],
})
export class AirlineModule {}
