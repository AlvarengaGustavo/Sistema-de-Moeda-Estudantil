import type { TUserRole } from "./TUserRole";

export interface IUser {
  id: string;
  name?: string;
  course?: string;
  email: string;
  role: TUserRole;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  balance?: number;
}
