import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Groupe } from "./Groupe"; // Import the Groupe entity
import { Account } from "./Account";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // Many students can belong to one Groupe
  @ManyToOne(() => Groupe, { eager: true })
  @JoinTable()
  groupe: Groupe;

  @OneToOne(() => Account, { eager: true })
  @JoinColumn()
  account: Account;
}
