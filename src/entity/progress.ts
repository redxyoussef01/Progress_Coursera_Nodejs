import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable } from 'typeorm';
import { Student } from './Student';
import { Course } from './Course';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  progressNumber: number;

  @Column({ type: 'longblob', nullable: true })
  screenshot: Buffer;

  @Column()
  annee: string;

  // Many progress entries can belong to one student
  @ManyToOne(() => Student, { eager: true })
  @JoinTable()
  student: Student;

  // Many progress entries can be associated with one course
  @ManyToOne(() => Course, { eager: true })
  @JoinTable()
  course: Course;
}

