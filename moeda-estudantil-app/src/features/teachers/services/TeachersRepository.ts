import type { AxiosInstance } from "axios";
import type {
  ICreateTeacher,
  IGetTeachersParams,
  IGetTeachersResponse,
  ITeacher,
  IUpdatedTeacher,
} from "../types/ITeacher";
import type { ITeachersRepository } from "../types/ITeachersRepository";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";
import { interpolateWithValues } from "../../../shared/utils/helperFunctions";

export class TeachersRepository implements ITeachersRepository {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAllTeachers(
    params: IGetTeachersParams
  ): Promise<IGetTeachersResponse> {
    const pageAndSkipQuery =
      params.page && params.limit
        ? `?page=${params.page}&limit=${params.limit}`
        : "";

    const nameQuery = params.name
      ? `${pageAndSkipQuery ? "&" : "?"}name=${params.name}`
      : "";

    const url = API_ROUTES.GET_TEACHERS + pageAndSkipQuery + nameQuery;

    const response = await this.api.get<IGetTeachersResponse>(url);

    return response.data;
  }

  async getTeacherById(id: string): Promise<ITeacher | null> {
    const url = interpolateWithValues(API_ROUTES.GET_TEACHER_BY_ID, id);

    const response = await this.api.get<ITeacher>(url);

    return response.data;
  }

  async createTeacher(payload: ICreateTeacher): Promise<ITeacher | null> {
    const response = await this.api.post<ITeacher>(API_ROUTES.CREATE_TEACHER, {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      department: payload.department,
      cpf: payload.cpf,
      institutionId: payload.institutionId,
    });

    return response.data;
  }

  async updateTeacher(payload: IUpdatedTeacher): Promise<ITeacher | null> {
    const url = interpolateWithValues(API_ROUTES.UPDATE_TEACHER, payload.id);

    const response = await this.api.put<ITeacher>(url, {
      email: payload.email,
      name: payload.name,
      department: payload.department,
      cpf: payload.cpf,
      institutionId: payload.institutionId,
      isActive: payload.isActive,
      ...(payload.password ? { password: payload.password } : {}),
    });

    return response.data;
  }
}
