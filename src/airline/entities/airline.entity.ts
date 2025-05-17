import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AirportEntity } from '../../airport/entities/airport.entity';

@Entity()
export class AirlineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  foundationDate: Date;

  @Column()
  website: string;

  @ManyToMany(() => AirportEntity, (airport) => airport.airlines)
  @JoinTable()
  airports: AirportEntity[];
}
