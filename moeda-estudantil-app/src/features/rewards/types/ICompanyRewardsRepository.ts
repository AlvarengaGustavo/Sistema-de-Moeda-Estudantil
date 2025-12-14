import type {
  ICreateCompanyRewardPayload,
  IReward,
  IUpdateCompanyRewardPayload,
} from "./IReward";

export interface ICompanyRewardsRepository {
  createReward(payload: ICreateCompanyRewardPayload): Promise<IReward>;
  updateReward(payload: IUpdateCompanyRewardPayload): Promise<IReward>;
  listRewards(): Promise<IReward[]>;
}

