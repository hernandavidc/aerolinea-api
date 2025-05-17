/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';
import { AirportModule } from './airport/airport.module';
import { AirlineEntity } from './airline/entities/airline.entity';
import { AirportEntity } from './airport/entities/airport.entity';
@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [AirlineEntity, AirportEntity],
      synchronize: true,
    }),
    AirlineModule,
    AirportModule,
    AirlineAirportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
