// Import necessary modules from TypeORM
import { Entity, PrimaryGeneratedColumn, Column ,OneToOne , JoinColumn } from 'typeorm';
import { Account } from './Account';
// Define the Professeur entity
@Entity()
export class Professeur {

  // Primary key, auto-incremented
  @PrimaryGeneratedColumn()
  id: number;

  // Last name of the professor
  @Column()
  nom: string;

  // First name of the professor
  @Column()
  prenom: string;

  // Other properties and methods can be added as needed
   // One professor has one account
  @OneToOne(() => Account, { eager: true })
  @JoinColumn()
  account: Account;

  
}
