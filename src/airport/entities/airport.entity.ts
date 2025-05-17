import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AirlineEntity } from '../../airline/entities/airline.entity';

@Entity()
export class AirportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @ManyToMany(() => AirlineEntity, (airline) => airline.airports)
  airlines: AirlineEntity[];
}
