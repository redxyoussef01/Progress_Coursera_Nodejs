import "reflect-metadata";
import { DataSource } from "typeorm";
import { Account } from "./entity/Account";

import { Annee } from "./entity/Annee";
import { Course } from "./entity/Course";
import { Enseigner } from "./entity/Enseigner";
import { Filiere } from "./entity/Filiere";
import { FiliereAnnee } from "./entity/FiliereAnnee";
import { Groupe } from "./entity/Groupe";
import { Note } from "./entity/Note";
import { Professeur } from "./entity/Professeur";
import { Progress } from "./entity/progress";
import { Student } from "./entity/Student";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "mysql",
  password: "",
  database: "test",
  synchronize: true,
  logging: false,
  entities: [
    Annee,
    Filiere,
    FiliereAnnee,
    Groupe,
    Professeur,
    Enseigner,
    Course,
    Student,
    Progress,
    Account,
    Note,
  ],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};
