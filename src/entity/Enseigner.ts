import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Professeur } from "./Professeur";
import { Groupe } from "./Groupe";
import { Course } from "./Course";

@Entity()
export class Enseigner {
  @PrimaryGeneratedColumn()
  id: number;

  // Many Enseigner can have one Professeur
  @ManyToOne(() => Professeur, { eager: true })
  @JoinColumn({ name: "professeurId" })
  professeur: Professeur;

  // Many Enseigner can have one groupe
  @ManyToOne(() => Groupe, { eager: true })
  @JoinColumn({ name: "groupeId" })
  Groupe: Groupe;

  // Many Enseigner can have one Course
  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: "courseId" })
  course: Course;
}
