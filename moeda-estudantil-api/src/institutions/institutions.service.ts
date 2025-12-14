import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstitutionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getInstitutions(page = 1, limit = 10, name?: string) {
    const [items, total] = await Promise.all([
      this.prismaService.institution.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          name: { contains: name, mode: 'insensitive' },
        },
        orderBy: { name: 'asc' },
      }),

      this.prismaService.institution.count({
        where: {
          name: { contains: name, mode: 'insensitive' },
        },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  getInstitutionById(id: string) {
    return this.prismaService.institution.findUnique({
      where: { id },
    });
  }

  createInstitution(name: string) {
    return this.prismaService.institution.create({
      data: { name },
    });
  }

  updateInstitution(id: string, name: string) {
    return this.prismaService.institution.update({
      where: { id },
      data: { name },
    });
  }
}
