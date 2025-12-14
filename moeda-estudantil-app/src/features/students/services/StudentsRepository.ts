import type { AxiosInstance } from "axios";
import type {
  IGetStudentsParams,
  IGetStudentsResponse,
  IStudent,
  IUpdatedStudent,
} from "../types/IStudent";
import type { IStudentsRepository } from "../types/IStudentsRepository";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";
import { interpolateWithValues } from "../../../shared/utils/helperFunctions";

export class StudentsRepository implements IStudentsRepository {
  private readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAllStudents(
    params: IGetStudentsParams
  ): Promise<IGetStudentsResponse> {
    const pageAndSkipQuery =
      params.page && params.limit
        ? `?page=${params.page}&limit=${params.limit}`
        : "";

    const nameQuery = params.name
      ? `${pageAndSkipQuery ? "&" : "?"}name=${params.name}`
      : "";

    const url = API_ROUTES.GET_STUDENTS + pageAndSkipQuery + nameQuery;

    const response = await this.api.get<IGetStudentsResponse>(url);

    return response.data;
  }

  async getStudentById(id: string): Promise<IStudent | null> {
    const url = interpolateWithValues(API_ROUTES.GET_STUDENT_BY_ID, id);

    const response = await this.api.get<IStudent>(url);

    return response.data;
  }

  async updateStudent(student: IUpdatedStudent): Promise<IStudent | null> {
    const url = interpolateWithValues(API_ROUTES.UPDATE_STUDENT, student.id);

    const response = await this.api.put<IStudent>(url, {
      name: student.name,
      email: student.email,
      cpf: student.cpf,
      address: student.address,
      course: student.course,
      institutionId: student.institutionId,
      isActive: student.isActive,
    });

    return response.data;
  }
}
