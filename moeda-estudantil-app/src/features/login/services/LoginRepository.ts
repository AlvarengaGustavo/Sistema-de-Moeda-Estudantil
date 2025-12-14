import type { AxiosInstance } from "axios";
import type { ILoginRepository } from "../types/ILoginRepository";
import type { ILoginRequest } from "../types/ILoginRequest";
import type { ILoginResponse } from "../types/ILoginResponse";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";
import type { IUser } from "../types/IUser";

export class LoginRepository implements ILoginRepository {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(request: ILoginRequest): Promise<ILoginResponse | null> {
    const url = API_ROUTES.LOGIN;

    const response = await this.api.post<ILoginResponse>(url, request);

    return response.data;
  }

  async getUserInfo(): Promise<IUser> {
    const route = API_ROUTES.USER_ME;

    const response = await this.api.get<IUser>(route);

    return response.data;
  }
}
