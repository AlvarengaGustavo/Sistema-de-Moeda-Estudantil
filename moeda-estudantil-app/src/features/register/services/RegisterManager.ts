import type { IRegisterRepository } from "../types/IRegisterRepository";

export class RegisterManager {
  private registerRepository: IRegisterRepository;

  constructor(registerRepository: IRegisterRepository) {
    this.registerRepository = registerRepository;
  }

  async createStudent(
    email: string,
    password: string,
    name: string,
    cpf: string,
    address: string,
    course: string,
    institutionId: string
  ) {
    return this.registerRepository.createStudent({
      email,
      password,
      name,
      cpf,
      address,
      course,
      institutionId,
    });
  }

  async createCompany(
    email: string,
    name: string,
    cnpj: string,
    password: string
  ) {
    return this.registerRepository.createCompany({
      email,
      name,
      cnpj,
      password,
    });
  }
}
