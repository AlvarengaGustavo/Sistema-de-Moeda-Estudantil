import type { ICompaniesRepository } from "../types/ICompaniesRepository";

export class CompaniesManager {
  private repository: ICompaniesRepository;

  constructor(repository: ICompaniesRepository) {
    this.repository = repository;
  }

  getCompanies(page?: number, limit?: number, name?: string) {
    return this.repository.getAllCompanies({ page, limit, name });
  }

  getCompanyById(id: string) {
    return this.repository.getCompanyById(id);
  }

  updateCompany(
    id: string,
    name: string,
    email: string,
    cnpj: string,
    isActive: boolean
  ) {
    return this.repository.updateCompany({
      id,
      name,
      email,
      cnpj,
      isActive,
    });
  }
}
