import type { IInstitutionsRepository } from "../types/IInstitutionsRepository";

export class InstitutionsManager {
  private repository: IInstitutionsRepository;

  constructor(repository: IInstitutionsRepository) {
    this.repository = repository;
  }

  getInstitutions(page?: number, limit?: number, name?: string) {
    return this.repository.getAllInstitutions({ page, limit, name });
  }

  getInstitutionById(id: string) {
    return this.repository.getInstitutionById(id);
  }

  createInstitution(name: string) {
    return this.repository.createInstitution({ name });
  }

  updateInstitution(id: string, name: string) {
    return this.repository.updateInstitution({ id, name });
  }
}
