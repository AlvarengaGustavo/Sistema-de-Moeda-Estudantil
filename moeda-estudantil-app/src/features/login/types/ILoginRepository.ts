import type { ILoginRequest } from "./ILoginRequest";
import type { ILoginResponse } from "./ILoginResponse";
import type { IUser } from "./IUser";

export interface ILoginRepository {
  login: (request: ILoginRequest) => Promise<ILoginResponse | null>;
  getUserInfo: () => Promise<IUser | null>;
}
