import type {
  IGetStudentsParams,
  IGetStudentsResponse,
  IStudent,
  IUpdatedStudent,
} from "./IStudent";

export interface IStudentsRepository {
  getAllStudents(params: IGetStudentsParams): Promise<IGetStudentsResponse>;
  getStudentById(id: string): Promise<IStudent | null>;
  updateStudent(student: IUpdatedStudent): Promise<IStudent | null>;
}
