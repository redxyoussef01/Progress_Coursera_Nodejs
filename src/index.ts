import { group } from "console";
import * as express from "express";
import { AppDataSource } from "./data-source";
import { FiliereAnnee } from "./entity/FiliereAnnee";
import { Groupe } from "./entity/Groupe";
import { Student } from "./entity/Student";
import { Account } from "./entity/Account";
import { Professeur } from "./entity/Professeur";
import { Annee } from "./entity/Annee";
import { Filiere } from "./entity/Filiere";
import { Course } from "./entity/Course";
const bcrypt = require("bcrypt");

const { getRepository } = require("typeorm");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/annees", async (req, res) => {
  try {
    const Annees = await AppDataSource.manager.find(Annee, {});
    res.json(Annees);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/filiere", async (req, res) => {
  try {
    const Filieres = await AppDataSource.manager.find(Filiere, {});
    res.json(Filieres);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/filiereannees", async (req, res) => {
  try {
    const filiereAnnees = await AppDataSource.manager.find(FiliereAnnee, {
      relations: ["annee", "filiere"],
    });
    res.json(filiereAnnees);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/filiereannees/:id", async (req, res) => {
  const filiereAnneeId = parseInt(req.params.id, 10); // Use base 10 for decimal numbers

  // Validate if filiereAnneeId is a valid number
  if (isNaN(filiereAnneeId)) {
    return res.status(400).json({ error: "Invalid FiliereAnnee ID" });
  }

  try {
    const filiereAnnee = await AppDataSource.manager.findOne(FiliereAnnee, {
      where: { id: filiereAnneeId },
      relations: ["annee", "filiere"],
    });

    if (filiereAnnee) {
      res.json(filiereAnnee);
    } else {
      res.status(404).json({ error: "FiliereAnnee not found" });
    }
  } catch (error) {
    console.error("Error fetching FiliereAnnee:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

const filiereAnneeRepository = AppDataSource.getRepository(FiliereAnnee);

app.post("/filiereannees", async (req, res) => {
  try {
    // Create a new FiliereAnnee instance
    const filiereAnnee = new FiliereAnnee();
    filiereAnnee.annee = req.body.anneeId;
    filiereAnnee.filiere = req.body.filiereId;
    // Save the FiliereAnnee instance to the database
    await filiereAnneeRepository.save(filiereAnnee);
    res.status(201).json({ message: "FiliereAnnee created successfully" });
  } catch (error) {
    console.error("Error creating FiliereAnnee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/filiereannee/:id", async (req, res) => {
  try {
    const filiereAnneeId: number = parseInt(req.params.id, 10);

    // Fetch the existing FiliereAnnee from the database
    const existingFiliereAnnee = await AppDataSource.manager.findOne(
      FiliereAnnee,
      {
        where: { id: filiereAnneeId },
        relations: ["annee", "filiere"],
      }
    );

    if (!existingFiliereAnnee) {
      return res.status(404).json({ error: "FiliereAnnee not found" });
    }

    const { anneeId, filiereId } = req.body;

    // Update the properties based on the request body
    existingFiliereAnnee.annee = anneeId;
    existingFiliereAnnee.filiere = filiereId;

    // Save the updated FiliereAnnee to the database
    await filiereAnneeRepository.save(existingFiliereAnnee);

    res.status(200).json({ message: "FiliereAnnee updated successfully" });
  } catch (error) {
    console.error("Error updating FiliereAnnee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/filiereannees/:id", async (req, res) => {
  const filiereAnneeId = parseInt(req.params.id, 10);

  try {
    // Find the FiliereAnnee by ID
    const filiereAnnee = await AppDataSource.manager.findOne(FiliereAnnee, {
      where: { id: filiereAnneeId },
    });

    if (!filiereAnnee) {
      return res.status(404).json({ message: "FiliereAnnee not found" });
    }

    // Remove the FiliereAnnee and its associated groupes from the database
    await AppDataSource.manager.remove(filiereAnnee);

    res.json({ message: "FiliereAnnee deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/groups", async (req, res) => {
  try {
    const groups = await AppDataSource.manager.find(Groupe, {
      relations: ["filiereAnnee", "filiereAnnee.annee", "filiereAnnee.filiere"],
    });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/groups/:id", async (req, res) => {
  const groupId = parseInt(req.params.id, 10);

  try {
    const group = await AppDataSource.manager.findOne(Groupe, {
      where: { id: groupId },
      relations: ["filiereAnnee", "filiereAnnee.annee", "filiereAnnee.filiere"],
    });

    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.post("/groups", async (req, res) => {
  try {
    const { groupName, filiereAnneeId /*, other properties */ } = req.body;

    // Fetch the FiliereAnnee based on the provided ID
    const filiereAnnee = await AppDataSource.manager.findOne(FiliereAnnee, {
      where: { id: filiereAnneeId },
    });

    if (!filiereAnnee) {
      return res.status(404).json({ message: "FiliereAnnee not found" });
    }

    // Create a new Groupe entity
    const newGroup = new Groupe();
    newGroup.groupName = groupName;
    newGroup.filiereAnnee = filiereAnneeId;

    // Save the new group to the database
    const GroupeRepository = AppDataSource.getRepository(Groupe);
    await GroupeRepository.save(newGroup);
    res.status(201).json({ message: "Groupe created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.put("/groups/:id", async (req, res) => {
  const groupId = parseInt(req.params.id, 10);
  const { groupName, filiereAnneeId } = req.body;

  try {
    // Find the group by ID
    const group = await AppDataSource.manager.findOne(Groupe, {
      where: { id: groupId },
      relations: [], // Include related FiliereAnnee for updating
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Update the related FiliereAnnee if provided
    if (filiereAnneeId) {
      const filiereAnnee = await AppDataSource.manager.findOne(FiliereAnnee, {
        where: { id: filiereAnneeId },
      });
      if (!filiereAnnee) {
        return res.status(400).json({ message: "FiliereAnnee not found" });
      }

      // Update the group properties
      group.groupName = groupName;
      group.filiereAnnee = filiereAnnee;
    }

    // Save the updated group to the database
    const updatedGroup = await AppDataSource.manager.save(group);

    res.json(updatedGroup);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.delete("/groups/:id", async (req, res) => {
  const groupId = parseInt(req.params.id, 10);

  try {
    // Find the group by ID
    const group = await AppDataSource.manager.findOne(Groupe, {
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the group from the database
    await AppDataSource.manager.remove(group);

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await AppDataSource.manager.find(Student, {
      relations: [
        "groupe",
        "groupe.filiereAnnee",
        "groupe.filiereAnnee.annee",
        "groupe.filiereAnnee.filiere",
        "account",
      ],
    });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  try {
    const students = await AppDataSource.manager.findOne(Student, {
      where: { id: studentId },
      relations: [
        "groupe",
        "groupe.filiereAnnee",
        "groupe.filiereAnnee.annee",
        "groupe.filiereAnnee.filiere",
        "account",
      ],
    });
    if (!students) {
      return res.status(404).json({ message: "student not found" });
    }

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  try {
    // Fetch the existing student based on the provided ID
    const existingStudent = await await AppDataSource.manager.findOne(Student, {
      where: { id: studentId },
    });

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete the student from the database
    const studentRepository = AppDataSource.getRepository(Student);
    await studentRepository.remove(existingStudent);

    res.json({ message: "Student deleted successfully" }); // 204 indicates successful deletion with no content
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.post("/students", async (req, res) => {
  try {
    const {
      email,
      password,
      type,
      firstName,
      lastName,
      groupId /* other properties */,
    } = req.body;

    // Trim the password before hashing
    const trimmedPassword = password.trim();

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    // Check if the email already exists in the database
    const existingAccount = await AppDataSource.manager.findOne(Account, {
      where: { email },
    });

    if (existingAccount) {
      // Email already exists, return an error response
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new account entity
    const newAccount = new Account();
    newAccount.email = email;
    newAccount.password = hashedPassword;
    newAccount.type = type;

    // Save the new account to the Account repository
    const accountRepository = AppDataSource.getRepository(Account);
    await accountRepository.save(newAccount);

    // Create a new student entity
    const newStudent = new Student();
    newStudent.firstName = firstName;
    newStudent.lastName = lastName;

    // Fetch the group based on the provided groupId
    const group = await AppDataSource.manager.findOne(Groupe, {
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    newStudent.groupe = group;
    newStudent.account = newAccount;

    // Save the new student to the database
    const studentRepository = AppDataSource.getRepository(Student);
    await studentRepository.save(newStudent);

    res.status(201).json(newStudent); // 201 indicates successful creation
  } catch (error) {
    console.error("Error during registration:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});
app.put("/students/:id", async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);
    const studentRepository = AppDataSource.getRepository(Student);

    // Fetch the student by ID
    const existingStudent = await AppDataSource.manager.findOne(Student, {
      where: { id: studentId },
      relations: [
        "groupe",
        "groupe.filiereAnnee",
        "groupe.filiereAnnee.annee",
        "groupe.filiereAnnee.filiere",
        "account",
      ],
    });

    // Check if the student exists
    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update the student properties based on the request body
    existingStudent.firstName = req.body.firstName || existingStudent.firstName;
    existingStudent.lastName = req.body.lastName || existingStudent.lastName;

    // If you want to update the associated Groupe, assuming Groupe ID is provided in the request body
    if (req.body.groupeId) {
      // Fetch the Groupe by ID
      const group = await AppDataSource.manager.findOne(Groupe, {
        where: { id: req.body.groupeId },
      });

      // Check if the Groupe exists
      if (!group) {
        return res.status(404).json({ error: "Groupe not found" });
      }

      // Update the student's Groupe
      existingStudent.groupe = group;
    }

    // Save the updated student to the database
    await studentRepository.save(existingStudent);

    res.json(existingStudent);
  } catch (error) {
    console.error("Error updating student:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trim the email and password values
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Find the account based on the trimmed email
    const account = await AppDataSource.manager.findOne(Account, {
      where: { email: trimmedEmail },
    });
    if (!account) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the trimmed password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(
      trimmedPassword,
      account.password
    );
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid credentials - Password mismatch" });
    }

    // At this point, the email and password are valid
    // You can implement additional logic here, such as creating and returning a JWT token

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/professeur/:id", async (req, res) => {
  try {
    const professeurId: number = parseInt(req.params.id, 10);

    // Fetch the Professeur from the database

    const professeur = await AppDataSource.manager.findOne(Professeur, {
      where: { id: professeurId },
      relations: ["account"],
    });

    if (!professeur) {
      return res.status(404).json({ error: "Professeur not found" });
    }

    res.status(200).json(professeur);
  } catch (error) {
    console.error("Error fetching Professeur:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/professeurs", async (req, res) => {
  try {
    // Fetch all Professeurs from the database

    const professeurs = await AppDataSource.manager.find(Professeur, {
      relations: ["account"],
    });

    res.status(200).json(professeurs);
  } catch (error) {
    console.error("Error fetching Professeurs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/professeur", async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAccount = await AppDataSource.manager.findOne(Account, {
      where: { email },
    });

    if (existingAccount) {
      // Email already exists, return an error response
      return res.status(400).json({ error: "Email already exists" });
    }
    // Create a new Account
    const newAccount = new Account();
    newAccount.email = email;
    newAccount.password = hashedPassword;
    newAccount.type = "Professeur";
    // Save the Account to the database
    const accountRepository = AppDataSource.getRepository(Account);
    const savedAccount = await accountRepository.save(newAccount);

    // Create a new Professeur and associate it with the saved Account
    const newProfesseur = new Professeur();
    newProfesseur.nom = nom;
    newProfesseur.prenom = prenom;
    newProfesseur.account = savedAccount;

    // Save the Professeur to the database
    const professeurRepository = AppDataSource.getRepository(Professeur);
    await professeurRepository.save(newProfesseur);

    res.status(201).json({ message: "Professeur created successfully" });
  } catch (error) {
    console.error("Error creating Professeur:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/professeur/:id", async (req, res) => {
  try {
    const professeurId: number = parseInt(req.params.id, 10);

    // Fetch the existing Professeur from the database
    const existingProfesseur = await AppDataSource.manager.findOne(Professeur, {
      where: { id: professeurId },
      relations: ["account"],
    });

    if (!existingProfesseur) {
      return res.status(404).json({ error: "Professeur not found" });
    }

    const { nom, prenom, email, password } = req.body;

    // Update the properties based on the request body
    existingProfesseur.nom = nom;
    existingProfesseur.prenom = prenom;

    const existingAccount = await AppDataSource.manager.findOne(Account, {
      where: { id: existingProfesseur.account.id },
    });
    // Update the email if provided
    if (email) {
      existingAccount.email = email;
    }

    // Update the password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingAccount.password = hashedPassword;
    }

    // Save the updated Professeur to the database
    await AppDataSource.manager.save(existingProfesseur);
    await AppDataSource.manager.save(existingAccount);
    res.status(200).json({ message: "Professeur updated successfully" });
  } catch (error) {
    console.error("Error updating Professeur:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/professeur/:id", async (req, res) => {
  try {
    const professeurId: number = parseInt(req.params.id, 10);

    // Fetch the existing Professeur from the database
    const existingProfesseur = await AppDataSource.manager.findOne(Professeur, {
      where: { id: professeurId },
      relations: ["account"],
    });

    if (!existingProfesseur) {
      return res.status(404).json({ message: "Professeur not found" });
    }

    const existingAccount = await AppDataSource.manager.findOne(Account, {
      where: { id: existingProfesseur.account.id },
    });

    // Delete the Professeur and associated Account
    await AppDataSource.manager.remove([
      existingProfesseur,
      existingProfesseur.account,
    ]);

    await AppDataSource.manager.remove([existingAccount]);

    res.status(200).json({ message: "Professeur deleted successfully" });
  } catch (error) {
    console.error("Error deleting Professeur:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const courses = await AppDataSource.manager.find(Course, {});
    res.json(courses);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/courses/:id", async (req, res) => {
  const courseId = parseInt(req.params.id, 10);

  try {
    const course = await AppDataSource.manager.findOne(Course, {
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
