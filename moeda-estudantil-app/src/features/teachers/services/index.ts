import api from "../../../shared/api/Api";
import { TeachersRepository } from "./TeachersRepository";
import { TeachersManager } from "./TeachersManager";

const teachersRepository = new TeachersRepository(api);
const teachersManagerInstance = new TeachersManager(teachersRepository);

export default teachersManagerInstance;
