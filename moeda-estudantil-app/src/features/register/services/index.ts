import api from "../../../shared/api/Api";
import { RegisterManager } from "./RegisterManager";
import { RegisterRepository } from "./RegisterRepository";

const registerRepositoryInstance = new RegisterRepository(api);
const registerManagerInstance = new RegisterManager(registerRepositoryInstance);

export default registerManagerInstance;
