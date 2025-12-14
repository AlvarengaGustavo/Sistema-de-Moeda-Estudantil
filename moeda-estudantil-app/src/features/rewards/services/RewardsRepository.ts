import type { AxiosInstance } from "axios";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";
import type {
  IBaseSuccessResponse,
  IDonateCoinsPayload,
  IInstitutionStudent,
  IRedeemRewardPayload,
  IReward,
  ITransactionsResponse,
} from "../types/IReward";
import type { IRewardsRepository } from "../types/IRewardsRepository";

export class RewardsRepository implements IRewardsRepository {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async donateCoins(
    payload: IDonateCoinsPayload
  ): Promise<IBaseSuccessResponse> {
    const response = await this.api.post<IBaseSuccessResponse>(
      API_ROUTES.DONATE_COINS,
      payload
    );

    return response.data;
  }

  async getTransactions(): Promise<ITransactionsResponse> {
    const response = await this.api.get<ITransactionsResponse>(
      API_ROUTES.GET_REWARD_TRANSACTIONS
    );

    return response.data;
  }

  async redeemReward(
    payload: IRedeemRewardPayload
  ): Promise<IBaseSuccessResponse> {
    const response = await this.api.post<IBaseSuccessResponse>(
      API_ROUTES.REDEEM_REWARD,
      payload
    );

    return response.data;
  }

  async getAvailableRewards(): Promise<IReward[]> {
    const response = await this.api.get<IReward[]>(
      API_ROUTES.GET_AVAILABLE_REWARDS
    );

    return response.data;
  }

  async getInstitutionStudents(): Promise<IInstitutionStudent[]> {
    const response = await this.api.get<IInstitutionStudent[]>(
      API_ROUTES.GET_INSTITUTION_STUDENTS
    );

    return response.data;
  }
}
