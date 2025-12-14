export interface IStudent {
  id: string;
  name: string;
  email: string;
  cpf: string;
  address: string;
  course: string;
  institutionId: string;
  institutionName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ICreateStudent {
  email: string;
  password: string;
  name: string;
  cpf: string;
  address: string;
  course: string;
  institutionId: string;
}

export interface IUpdatedStudent {
  id: string;
  name: string;
  email: string;
  cpf: string;
  address: string;
  course: string;
  institutionId: string;
  isActive: boolean;
}

export interface IGetStudentsParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface IGetStudentsResponse {
  items: IStudent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
