import type { AxiosInstance } from "axios";
import type { IRegisterRepository } from "../types/IRegisterRepository";
import type { ICreateStudent } from "../../students/types/IStudent";
import type { ICreateCompany } from "../../companies/types/ICompany";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";

export class RegisterRepository implements IRegisterRepository {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async createStudent(student: ICreateStudent) {
    const response = await this.api.post(API_ROUTES.CREATE_STUDENT, student);
    return response.data;
  }

  async createCompany(company: ICreateCompany) {
    const response = await this.api.post(API_ROUTES.CREATE_COMPANY, company);
    return response.data;
  }
}
