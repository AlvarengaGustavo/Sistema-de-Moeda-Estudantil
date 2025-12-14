import { LoginManager } from "./LoginManager";
import apiInstance from "../../../shared/api/Api";
import { LoginRepository } from "./LoginRepository";

const loginRepositoryInstance = new LoginRepository(apiInstance);
const loginManagerInstance = new LoginManager(loginRepositoryInstance);

export default loginManagerInstance;
