export interface ITeacher {
  id: string;
  name: string;
  department: string;
  email: string;
  cpf: string;
  institutionId: string;
  institutionName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  balance?: number;
  lastSemesterRewardAt?: Date | null;
}

export interface ICreateTeacher {
  email: string;
  password: string;
  name: string;
  department: string;
  cpf: string;
  institutionId: string;
}

export interface IUpdatedTeacher {
  id: string;
  name: string;
  department: string;
  email: string;
  cpf: string;
  institutionId: string;
  isActive: boolean;
  password?: string;
}

export interface IGetTeachersParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface IGetTeachersResponse {
  items: ITeacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
