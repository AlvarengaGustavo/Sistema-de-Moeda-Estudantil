import type {
  ICreateTeacher,
  IGetTeachersParams,
  IGetTeachersResponse,
  ITeacher,
  IUpdatedTeacher,
} from "./ITeacher";

export interface ITeachersRepository {
  getAllTeachers(params: IGetTeachersParams): Promise<IGetTeachersResponse>;
  getTeacherById(id: string): Promise<ITeacher | null>;
  createTeacher(payload: ICreateTeacher): Promise<ITeacher | null>;
  updateTeacher(payload: IUpdatedTeacher): Promise<ITeacher | null>;
}
