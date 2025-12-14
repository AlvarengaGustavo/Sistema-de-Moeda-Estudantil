import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/common/utils/password.utils';
import { Role } from 'generated/prisma/enums';
import { CreateTeacherDTO } from './dto/create-teacher-dto';
import { UpdateTeacherDTO } from './dto/update-teacher-dto';

@Injectable()
export class TeachersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTeacher(createTeacherDTO: CreateTeacherDTO) {
    const { email, password, institutionId, ...teacherInfo } = createTeacherDTO;

    const hashedPassword = await hashPassword(password);

    const userData = {
      email,
      password: hashedPassword,
      role: Role.TEACHER,
    };

    const teacherData = {
      ...teacherInfo,
      institution: {
        connect: { id: institutionId },
      },
      user: {
        create: userData,
      },
    };

    const createdTeacher = await this.prismaService.teacher.create({
      data: teacherData,
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
      id: createdTeacher.user.id,
      email: createdTeacher.user.email,
      role: createdTeacher.user.role,
      createdAt: createdTeacher.user.createdAt,
      updatedAt: createdTeacher.user.updatedAt,
      isActive: createdTeacher.user.isActive,
      name: createdTeacher.name,
      department: createdTeacher.department,
    };
  }

  async getTeachers(page = 1, limit = 10, name?: string) {
    const total = await this.prismaService.teacher.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
    });

    const teachers = await this.prismaService.teacher.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
      select: {
        name: true,
        department: true,
        institutionId: true,
        balance: true,
        cpf: true,
        lastSemesterRewardAt: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        institution: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const items = teachers.map((teacher) => ({
      id: teacher.user.id,
      email: teacher.user.email,
      name: teacher.name,
      role: teacher.user.role,
      createdAt: teacher.user.createdAt,
      updatedAt: teacher.user.updatedAt,
      isActive: teacher.user.isActive,
      institutionId: teacher.institutionId,
      institutionName: teacher.institution.name,
      balance: teacher.balance,
      cpf: teacher.cpf,
      lastSemesterRewardAt: teacher.lastSemesterRewardAt,
      department: teacher.department,
    }));

    const totalPages = Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }

  async getTeacherById(id: string) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { userId: id },
      select: {
        name: true,
        department: true,
        institutionId: true,
        balance: true,
        cpf: true,
        lastSemesterRewardAt: true,
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

    if (!teacher) {
      return null;
    }

    return {
      id: teacher.user.id,
      email: teacher.user.email,
      role: teacher.user.role,
      isActive: teacher.user.isActive,
      createdAt: teacher.user.createdAt,
      updatedAt: teacher.user.updatedAt,
      name: teacher.name,
      institutionId: teacher.institutionId,
      institutionName: teacher.institution.name,
      balance: teacher.balance,
      cpf: teacher.cpf,
      lastSemesterRewardAt: teacher.lastSemesterRewardAt,
      department: teacher.department,
    };
  }

  async updateTeacher(id: string, updatedTeacherData: UpdateTeacherDTO) {
    const { institutionId, email, password, isActive, ...teacherInfo } =
      updatedTeacherData;

    const updatedTeacher = await this.prismaService.teacher.update({
      where: { userId: id },
      data: {
        ...teacherInfo,
        institution: {
          connect: { id: institutionId },
        },
      },
    });

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        email: email,
        ...(password && {
          password: await hashPassword(password),
        }),
        isActive: isActive,
        role: Role.TEACHER,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      isActive: updatedUser.isActive,
      name: updatedTeacher.name,
      department: updatedTeacher.department,
    };
  }

  async getAllTeachersIds() {
    return this.prismaService.teacher.findMany({
      select: {
        id: true,
      },
    });
  }

  async updateTeacherBalance(id: string, newBalance: number, date: Date) {
    const teacher = await this.prismaService.teacher.update({
      where: { id: id },
      data: {
        balance: { increment: newBalance },
        lastSemesterRewardAt: date,
      },
    });

    await this.prismaService.transaction.create({
      data: {
        amount: newBalance,
        description: 'Recarga semestral',
        type: 'RECHARGE',
        teacherId: teacher.id,
      },
    });
  }
}
