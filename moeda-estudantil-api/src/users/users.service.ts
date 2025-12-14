import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDTO } from './dto/create-student-dto';
import { comparePassword, hashPassword } from 'src/common/utils/password.utils';
import { Role } from 'generated/prisma/enums';
import { UpdateStudentDTO } from './dto/update-student-dto';
import { CreateCompanyDto } from './dto/create-company-dto';
import { UpdateCompanyDto } from './dto/update-company-dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createStudent(studentDto: CreateStudentDTO) {
    const { email, password, institutionId, ...studentInfo } = studentDto;

    const hashedPassword = await hashPassword(password);

    const userData = {
      email,
      password: hashedPassword,
      role: Role.STUDENT,
    };

    const studentData = {
      ...studentInfo,
      institution: {
        connect: { id: institutionId },
      },
      user: {
        create: userData,
      },
    };

    const createdStudent = await this.prismaService.student.create({
      data: studentData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
          },
        },
      },
    });

    return {
      id: createdStudent.user.id,
      email: createdStudent.user.email,
      name: createdStudent.name,
      role: createdStudent.user.role,
      createdAt: createdStudent.user.createdAt,
      updatedAt: createdStudent.user.updatedAt,
      isActive: createdStudent.user.isActive,
    };
  }

  async getStudents(page = 1, limit = 10, name?: string) {
    const total = await this.prismaService.student.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
    });

    const students = await this.prismaService.student.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
      orderBy: { name: 'asc' },
      select: {
        name: true,
        cpf: true,
        address: true,
        course: true,
        institutionId: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
          },
        },
        institution: {
          select: {
            name: true,
          },
        },
      },
    });

    const items = students.map((student) => ({
      id: student.user.id,
      email: student.user.email,
      role: student.user.role,
      createdAt: student.user.createdAt,
      updatedAt: student.user.updatedAt,
      name: student.name,
      cpf: student.cpf,
      address: student.address,
      course: student.course,
      institutionId: student.institutionId,
      institutionName: student.institution.name,
      isActive: student.user.isActive,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getStudentById(id: string) {
    const student = await this.prismaService.student.findUnique({
      where: { userId: id },
      select: {
        name: true,
        cpf: true,
        address: true,
        course: true,
        institutionId: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    return {
      id: student.user.id,
      email: student.user.email,
      role: student.user.role,
      createdAt: student.user.createdAt,
      updatedAt: student.user.updatedAt,
      name: student.name,
      cpf: student.cpf,
      address: student.address,
      course: student.course,
      institutionId: student.institutionId,
      isActive: student.user.isActive,
    };
  }

  async updateStudent(id: string, updateStudentDTO: UpdateStudentDTO) {
    const updatedStudent = await this.prismaService.student.update({
      where: { userId: id },
      data: {
        name: updateStudentDTO.name,
        cpf: updateStudentDTO.cpf,
        address: updateStudentDTO.address,
        course: updateStudentDTO.course,
        institutionId: updateStudentDTO.institutionId,
      },
    });

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        email: updateStudentDTO.email,
        ...(updateStudentDTO.password && {
          password: await hashPassword(updateStudentDTO.password),
        }),
        isActive: updateStudentDTO.isActive,
        role: Role.STUDENT,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      name: updatedStudent.name,
      cpf: updatedStudent.cpf,
      address: updatedStudent.address,
      course: updatedStudent.course,
      institutionId: updatedStudent.institutionId,
      isActive: updatedUser.isActive,
    };
  }

  async getCompanies(page = 1, limit = 10, name?: string) {
    const total = await this.prismaService.company.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
    });

    const companies = await this.prismaService.company.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
      select: {
        name: true,
        cnpj: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const items = companies.map((company) => ({
      id: company.user.id,
      email: company.user.email,
      role: company.user.role,
      createdAt: company.user.createdAt,
      updatedAt: company.user.updatedAt,
      name: company.name,
      cnpj: company.cnpj,
      isActive: company.user.isActive,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getCompanyById(id: string) {
    const company = await this.prismaService.company.findUnique({
      where: { userId: id },
      select: {
        name: true,
        cnpj: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
          },
        },
      },
    });

    if (!company) {
      return null;
    }

    return {
      id: company.user.id,
      email: company.user.email,
      role: company.user.role,
      createdAt: company.user.createdAt,
      updatedAt: company.user.updatedAt,
      name: company.name,
      cnpj: company.cnpj,
      isActive: company.user.isActive,
    };
  }

  async createCompany(company: CreateCompanyDto) {
    const { email, password, name, cnpj } = company;

    const hashedPassword = await hashPassword(password);

    const userData = {
      email,
      password: hashedPassword,
      role: Role.COMPANY,
      isActive: false,
    };

    const companyData = {
      name,
      cnpj,
    };

    const createdCompany = await this.prismaService.company.create({
      data: {
        ...companyData,
        user: {
          create: userData,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    return {
      id: createdCompany.user.id,
      email: createdCompany.user.email,
      role: createdCompany.user.role,
      createdAt: createdCompany.user.createdAt,
      updatedAt: createdCompany.user.updatedAt,
      isActive: createdCompany.user.isActive,
      name: createdCompany.name,
      cnpj: createdCompany.cnpj,
    };
  }

  async updateCompany(id: string, companyUpdatedData: UpdateCompanyDto) {
    const updatedCompany = await this.prismaService.company.update({
      where: { userId: id },
      data: {
        name: companyUpdatedData.name,
        cnpj: companyUpdatedData.cnpj,
      },
    });

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        email: companyUpdatedData.email,
        ...(companyUpdatedData.password && {
          password: await hashPassword(companyUpdatedData.password),
        }),
        isActive: companyUpdatedData.isActive,
        role: Role.COMPANY,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      name: updatedCompany.name,
      cnpj: updatedCompany.cnpj,
      isActive: updatedUser.isActive,
    };
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      select: {
        id: true,
        role: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        company: true,
        student: true,
        teacher: true,
      },
      where: { id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      ...(user.role === Role.STUDENT && {
        name: user.student?.name,
        course: user.student?.course,
        balance: user.student?.balance,
      }),
      ...(user.role === Role.TEACHER && {
        name: user.teacher?.name,
        balance: user.teacher?.balance,
      }),
      ...(user.role === Role.COMPANY && {
        name: user.company?.name,
      }),
    };
  }

  async updateCredentials(
    id: string,
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        email,
        ...(newPassword && {
          password: await hashPassword(newPassword),
        }),
      },
      include: {
        student: true,
        teacher: true,
        company: true,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      isActive: updatedUser.isActive,
      ...(updatedUser.role === Role.STUDENT && {
        name: updatedUser.student?.name,
        course: updatedUser.student?.course,
        balance: updatedUser.student?.balance,
      }),
      ...(updatedUser.role === Role.TEACHER && {
        name: updatedUser.teacher?.name,
        balance: updatedUser.teacher?.balance,
      }),
      ...(updatedUser.role === Role.COMPANY && {
        name: updatedUser.company?.name,
      }),
    };
  }
}
