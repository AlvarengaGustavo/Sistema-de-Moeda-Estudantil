import type { ICompany, ICreateCompany } from "../../companies/types/ICompany";
import type { ICreateStudent, IStudent } from "../../students/types/IStudent";

export interface IRegisterRepository {
  createStudent(student: ICreateStudent): Promise<IStudent | null>;
  createCompany(company: ICreateCompany): Promise<ICompany | null>;
}
