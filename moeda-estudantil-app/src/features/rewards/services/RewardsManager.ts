import type { IDonateCoinsPayload, IRedeemRewardPayload } from "../types/IReward";
import type { IRewardsRepository } from "../types/IRewardsRepository";

export class RewardsManager {
  private repository: IRewardsRepository;

  constructor(repository: IRewardsRepository) {
    this.repository = repository;
  }

  getInstitutionStudents() {
    return this.repository.getInstitutionStudents();
  }

  getTransactions() {
    return this.repository.getTransactions();
  }

  getAvailableRewards() {
    return this.repository.getAvailableRewards();
  }

  donateCoins(payload: IDonateCoinsPayload) {
    return this.repository.donateCoins(payload);
  }

  redeemReward(payload: IRedeemRewardPayload) {
    return this.repository.redeemReward(payload);
  }
}

