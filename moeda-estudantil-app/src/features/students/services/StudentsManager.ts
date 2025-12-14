import type { IStudentsRepository } from "../types/IStudentsRepository";

export class StudentsManager {
  private repository: IStudentsRepository;

  constructor(repository: IStudentsRepository) {
    this.repository = repository;
  }

  getStudents(page?: number, limit?: number, name?: string) {
    return this.repository.getAllStudents({ page, limit, name });
  }

  getStudentById(id: string) {
    return this.repository.getStudentById(id);
  }

  updateStudent(
    id: string,
    name: string,
    email: string,
    cpf: string,
    address: string,
    course: string,
    institutionId: string,
    isActive: boolean
  ) {
    return this.repository.updateStudent({
      id,
      name,
      email,
      cpf,
      address,
      course,
      institutionId,
      isActive,
    });
  }
}
