import type {
  IBaseSuccessResponse,
  IDonateCoinsPayload,
  IInstitutionStudent,
  IRedeemRewardPayload,
  IReward,
  ITransactionsResponse,
} from "./IReward";

export interface IRewardsRepository {
  donateCoins(payload: IDonateCoinsPayload): Promise<IBaseSuccessResponse>;
  getTransactions(): Promise<ITransactionsResponse>;
  redeemReward(payload: IRedeemRewardPayload): Promise<IBaseSuccessResponse>;
  getAvailableRewards(): Promise<IReward[]>;
  getInstitutionStudents(): Promise<IInstitutionStudent[]>;
}
