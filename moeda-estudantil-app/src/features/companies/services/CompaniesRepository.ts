import type { AxiosInstance } from "axios";
import type { ICompaniesRepository } from "../types/ICompaniesRepository";
import type {
  ICompany,
  IGetCompaniesParams,
  IGetCompaniesResponse,
} from "../types/ICompany";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";
import { interpolateWithValues } from "../../../shared/utils/helperFunctions";

export class CompaniesRepository implements ICompaniesRepository {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAllCompanies(
    params: IGetCompaniesParams
  ): Promise<IGetCompaniesResponse> {
    const pageAndSkipQuery =
      params.page && params.limit
        ? `?page=${params.page}&limit=${params.limit}`
        : "";

    const nameQuery = params.name
      ? `${pageAndSkipQuery ? "&" : "?"}name=${params.name}`
      : "";

    const url = API_ROUTES.GET_COMPANIES + pageAndSkipQuery + nameQuery;

    const response = await this.api.get<IGetCompaniesResponse>(url);

    return response.data;
  }

  async getCompanyById(id: string): Promise<ICompany | null> {
    const url = interpolateWithValues(API_ROUTES.GET_COMPANY_BY_ID, id);

    const response = await this.api.get<ICompany>(url);

    return response.data;
  }

  async updateCompany(company: ICompany): Promise<ICompany | null> {
    const url = interpolateWithValues(API_ROUTES.UPDATE_COMPANY, company.id);

    const response = await this.api.put<ICompany>(url, {
      name: company.name,
      email: company.email,
      cnpj: company.cnpj,
      isActive: company.isActive,
    });

    return response.data;
  }
}
