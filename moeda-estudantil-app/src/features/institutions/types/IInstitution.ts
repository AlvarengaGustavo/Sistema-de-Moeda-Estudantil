export interface IInstitution {
  id: string;
  name: string;
  createdAt: Date;
}

export interface INewInstitution {
  name: string;
}

export interface IUpdatedInstitution {
  id: string;
  name: string;
}

export interface IGetInstitutionsParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface IGetInstitutionsResponse {
  items: IInstitution[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
