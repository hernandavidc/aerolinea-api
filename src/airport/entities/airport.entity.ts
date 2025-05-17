import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AirlineEntity } from '../../airline/entities/airline.entity';

@Entity()
export class AirportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @ManyToMany(() => AirlineEntity, (airline) => airline.aeropuertos)
  aerolineas: AirlineEntity[];
}
