import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
} from "typeorm";
import { Course } from "./Course";
import { Student } from "./Student";
@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  note: number;

  // Many progress entries can belong to one student
  @ManyToOne(() => Student, { eager: true })
  @JoinTable()
  student: Student;

  // Many progress entries can be associated with one course
  @ManyToOne(() => Course, { eager: true })
  @JoinTable()
  course: Course;
}
