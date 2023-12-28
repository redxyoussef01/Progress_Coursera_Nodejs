import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';

import { FiliereAnnee } from './FiliereAnnee';

@Entity()
export class Filiere {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filiereName: string;


  // One-to-Many relation with FiliereAnnee
  @OneToMany(() => FiliereAnnee, filiereAnnee => filiereAnnee.filiere)
  filiereAnnees: FiliereAnnee[];
}
