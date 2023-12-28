// Annee.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { FiliereAnnee } from './FiliereAnnee';

@Entity()
export class Annee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  yearName: string;

  
  
  // One-to-Many relation with FiliereAnnee
  @OneToMany(() => FiliereAnnee, filiereAnnee => filiereAnnee.annee)
  filiereAnnees: FiliereAnnee[];
}
