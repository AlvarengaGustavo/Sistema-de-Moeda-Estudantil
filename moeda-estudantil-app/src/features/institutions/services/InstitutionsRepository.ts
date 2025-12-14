import type { AxiosInstance } from "axios";
import type {
  IGetInstitutionsParams,
  IGetInstitutionsResponse,
  IInstitution,
  INewInstitution,
  IUpdatedInstitution,
} from "../types/IInstitution";
import type { IInstitutionsRepository } from "../types/IInstitutionsRepository";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";
import { interpolateWithValues } from "../../../shared/utils/helperFunctions";

export class InstitutionsRepository implements IInstitutionsRepository {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAllInstitutions(
    params: IGetInstitutionsParams
  ): Promise<IGetInstitutionsResponse> {
    const pageAndSkipQuery =
      params.page && params.limit
        ? `?page=${params.page}&limit=${params.limit}`
        : "";

    const nameQuery = params.name
      ? `${pageAndSkipQuery ? "&" : "?"}name=${params.name}`
      : "";

    const url = API_ROUTES.GET_INSTITUTIONS + pageAndSkipQuery + nameQuery;

    const response = await this.api.get<IGetInstitutionsResponse>(url);

    return response.data;
  }

  async getInstitutionById(id: string): Promise<IInstitution | null> {
    const url = interpolateWithValues(API_ROUTES.GET_INSTITUTION_BY_ID, id);

    const response = await this.api.get<IInstitution>(url);

    return response.data;
  }

  async createInstitution(
    newInstitution: INewInstitution
  ): Promise<IInstitution> {
    const url = API_ROUTES.CREATE_INSTITUTION;

    const response = await this.api.post<IInstitution>(url, newInstitution);

    return response.data;
  }

  async updateInstitution(
    institution: IUpdatedInstitution
  ): Promise<IInstitution | null> {
    const url = interpolateWithValues(
      API_ROUTES.UPDATE_INSTITUTION,
      institution.id
    );

    const response = await this.api.put<IInstitution>(url, {
      name: institution.name,
    });

    return response.data;
  }
}
