import apiInstance from "../../../shared/api/Api";
import { CompaniesManager } from "./CompaniesManager";
import { CompaniesRepository } from "./CompaniesRepository";

const companiesRepositoryInstance = new CompaniesRepository(apiInstance);
const companiesManagerInstance = new CompaniesManager(
  companiesRepositoryInstance
);

export default companiesManagerInstance;
