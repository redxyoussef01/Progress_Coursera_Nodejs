import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Annee } from "./Annee";
import { Filiere } from "./Filiere";
import { Groupe } from "./Groupe";

@Entity()
export class FiliereAnnee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Annee, (annee) => annee.filiereAnnees)
  annee: Annee;

  @ManyToOne(() => Filiere, (filiere) => filiere.filiereAnnees)
  filiere: Filiere;

  // One-to-Many relation with Groupe
  @OneToMany(() => Groupe, (groupe) => groupe.filiereAnnee)
  groupes: Groupe[];
}
