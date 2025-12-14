export interface ICompany {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ICreateCompany {
  email: string;
  password: string;
  name: string;
  cnpj: string;
}

export interface IGetCompaniesParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface IGetCompaniesResponse {
  items: ICompany[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IUpdatedCompany {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  isActive: boolean;
}
