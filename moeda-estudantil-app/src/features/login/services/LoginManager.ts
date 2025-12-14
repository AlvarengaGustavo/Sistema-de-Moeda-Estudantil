import type { ILoginRepository } from "../types/ILoginRepository";

export class LoginManager {
  private readonly loginRepository: ILoginRepository;

  constructor(loginRepository: ILoginRepository) {
    this.loginRepository = loginRepository;
  }

  async login(email: string, password: string) {
    const request = {
      email,
      password,
    };

    const data = await this.loginRepository.login(request);

    if (!data?.access_token) {
      throw new Error("Login failed");
    }

    return data.access_token;
  }

  async getAuthenticatedUserInfo() {
    const userInfo = await this.loginRepository.getUserInfo();

    return userInfo;
  }
}
