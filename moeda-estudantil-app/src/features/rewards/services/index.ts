import api from "../../../shared/api/Api";
import { RewardsRepository } from "./RewardsRepository";
import { RewardsManager } from "./RewardsManager";
import { CompanyRewardsRepository } from "./CompanyRewardsRepository";
import { CompanyRewardsManager } from "./CompanyRewardsManager";

const rewardsRepository = new RewardsRepository(api);
const companyRewardsRepository = new CompanyRewardsRepository(api);

export const rewardsManagerInstance = new RewardsManager(rewardsRepository);
export const companyRewardsManagerInstance = new CompanyRewardsManager(
  companyRewardsRepository
);

