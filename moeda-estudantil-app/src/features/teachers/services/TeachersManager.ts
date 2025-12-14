import type { ITeachersRepository } from "../types/ITeachersRepository";
import type { ICreateTeacher, IUpdatedTeacher } from "../types/ITeacher";

export class TeachersManager {
  private repository: ITeachersRepository;

  constructor(repository: ITeachersRepository) {
    this.repository = repository;
  }

  getTeachers(page?: number, limit?: number, name?: string) {
    return this.repository.getAllTeachers({ page, limit, name });
  }

  getTeacherById(id: string) {
    return this.repository.getTeacherById(id);
  }

  createTeacher(payload: ICreateTeacher) {
    return this.repository.createTeacher(payload);
  }

  updateTeacher(payload: IUpdatedTeacher) {
    return this.repository.updateTeacher(payload);
  }
}
