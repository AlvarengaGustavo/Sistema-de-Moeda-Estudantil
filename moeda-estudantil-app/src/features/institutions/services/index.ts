import apiInstance from "../../../shared/api/Api";
import { InstitutionsManager } from "./InstitutionsManager";
import { InstitutionsRepository } from "./InstitutionsRepository";

const institutionsRepositoryInstance = new InstitutionsRepository(apiInstance);
const institutionsManagerInstance = new InstitutionsManager(
  institutionsRepositoryInstance
);

export default institutionsManagerInstance;
