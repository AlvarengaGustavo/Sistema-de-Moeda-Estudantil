import type { AxiosInstance } from "axios";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";
import { interpolateWithValues } from "../../../shared/utils/helperFunctions";
import type {
  ICreateCompanyRewardPayload,
  IReward,
  IUpdateCompanyRewardPayload,
} from "../types/IReward";
import type { ICompanyRewardsRepository } from "../types/ICompanyRewardsRepository";

export class CompanyRewardsRepository implements ICompanyRewardsRepository {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async createReward(
    payload: ICreateCompanyRewardPayload
  ): Promise<IReward> {
    const response = await this.api.post<IReward>(
      API_ROUTES.CREATE_COMPANY_REWARD,
      payload
    );

    return response.data;
  }

  async updateReward(payload: IUpdateCompanyRewardPayload): Promise<IReward> {
    const url = interpolateWithValues(
      API_ROUTES.UPDATE_COMPANY_REWARD,
      payload.id
    );

    const response = await this.api.patch<IReward>(url, {
      name: payload.name,
      description: payload.description,
      amount: payload.amount,
      imageUrl: payload.imageUrl,
      isActive: payload.isActive,
    });

    return response.data;
  }

  async listRewards(): Promise<IReward[]> {
    const response = await this.api.get<IReward[]>(
      API_ROUTES.GET_COMPANY_REWARDS
    );

    return response.data;
  }
}

