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
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fechaFundacion: Date;

  @Column()
  website: string;

  @ManyToMany(() => AirportEntity, (airport) => airport.aerolineas)
  @JoinTable()
  aeropuertos: AirportEntity[];
}
