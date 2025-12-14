import api from "../../../shared/api/Api";
import { StudentsRepository } from "./StudentsRepository";
import { StudentsManager } from "./StudentsManager";

const studentsRepository = new StudentsRepository(api);
const studentsManagerInstance = new StudentsManager(studentsRepository);

export default studentsManagerInstance;
