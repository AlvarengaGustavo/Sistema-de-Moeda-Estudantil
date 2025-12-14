import type {
  ICreateCompanyRewardPayload,
  IUpdateCompanyRewardPayload,
} from "../types/IReward";
import type { ICompanyRewardsRepository } from "../types/ICompanyRewardsRepository";

export class CompanyRewardsManager {
  private repository: ICompanyRewardsRepository;

  constructor(repository: ICompanyRewardsRepository) {
    this.repository = repository;
  }

  listRewards() {
    return this.repository.listRewards();
  }

  createReward(payload: ICreateCompanyRewardPayload) {
    return this.repository.createReward(payload);
  }

  updateReward(payload: IUpdateCompanyRewardPayload) {
    return this.repository.updateReward(payload);
  }
}

