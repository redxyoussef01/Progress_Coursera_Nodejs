import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { FiliereAnnee } from "./FiliereAnnee";

@Entity()
export class Groupe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupName: string;

  // Many-to-One relation with FiliereAnnee
  @ManyToOne(() => FiliereAnnee, (filiereAnnee) => filiereAnnee.groupes)
  filiereAnnee: FiliereAnnee;
}
