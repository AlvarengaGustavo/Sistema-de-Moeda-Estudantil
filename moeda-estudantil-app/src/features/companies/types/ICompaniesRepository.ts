import type {
  ICompany,
  IGetCompaniesParams,
  IGetCompaniesResponse,
  IUpdatedCompany,
} from "./ICompany";

export interface ICompaniesRepository {
  getAllCompanies(params: IGetCompaniesParams): Promise<IGetCompaniesResponse>;
  getCompanyById(id: string): Promise<ICompany | null>;
  updateCompany(company: IUpdatedCompany): Promise<ICompany | null>;
}
