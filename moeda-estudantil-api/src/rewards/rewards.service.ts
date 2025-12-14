import { Injectable, BadRequestException } from '@nestjs/common';
import { Role, TransactionType } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { RewardsEmailService } from './rewards-email.service';

@Injectable()
export class RewardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rewardsEmailService: RewardsEmailService,
  ) {}

  async donateCoins(
    teacherId: string,
    dto: { studentId: string; amount: number; reason: string },
  ) {
    const { studentId, amount, reason } = dto;

    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: teacherId },
      include: { user: true },
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }

    if (teacher.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    const student = await this.prisma.student.findUnique({
      where: { userId: studentId },
      include: { user: true },
    });

    if (!student) {
      throw new BadRequestException('Student not found');
    }

    if (student.institutionId !== teacher.institutionId)
      throw new BadRequestException(
        'Student does not belong to the same institution',
      );

    const transaction = await this.prisma.$transaction([
      this.prisma.teacher.update({
        where: { userId: teacherId },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.student.update({
        where: { userId: studentId },
        data: { balance: { increment: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          amount,
          description: reason,
          type: TransactionType.DONATION,
          teacherId: teacher.id,
          studentId: student.id,
        },
      }),
    ]);

    await this.rewardsEmailService.sendTeacherDonationEmail(
      student.name,
      teacher.name,
      teacher.user.email,
      transaction[2].amount,
      transaction[2].description,
    );
    await this.rewardsEmailService.sendStudentDonationEmail(
      student.name,
      teacher.name,
      student.user.email,
      transaction[2].amount,
      transaction[2].description,
    );

    return { success: true };
  }

  async getTransactions(userId: string, role: Role) {
    if (role === 'TEACHER') {
      const teacher = await this.prisma.teacher.findUnique({
        where: { userId },
      });

      const transactions = await this.prisma.transaction.findMany({
        where: { teacher: { userId } },
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: { name: true, user: { select: { email: true } } },
          },
        },
      });

      const items = transactions.map((tx) => ({
        ...tx,
        studentName: tx.student?.name || null,
        studentEmail: tx.student?.user.email || null,
      }));

      return {
        transactions: items,
        balance: teacher?.balance || null,
      };
    } else if (role === 'STUDENT') {
      const student = await this.prisma.student.findUnique({
        where: { userId },
      });

      const transactions = await this.prisma.transaction.findMany({
        where: { student: { userId } },
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: {
            select: { name: true, user: { select: { email: true } } },
          },
        },
      });

      const items = transactions.map((tx) => ({
        ...tx,
        teacherName: tx.teacher?.name || null,
        teacherEmail: tx.teacher?.user.email || null,
      }));

      return {
        transactions: items,
        balance: student?.balance || null,
      };
    } else {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          reward: {
            company: {
              userId: userId,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: { name: true, user: { select: { email: true } } },
          },
        },
      });

      const items = transactions.map((tx) => ({
        ...tx,
        studentName: tx.student?.name || null,
        studentEmail: tx.student?.user.email || null,
      }));

      return {
        transactions: items,
      };
    }
  }

  async redeemReward(studentId: string, rewardId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId: studentId },
      include: { user: true },
    });
    if (!student) throw new BadRequestException('Student not found');

    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
      include: { company: { include: { user: true } } },
    });
    if (!reward || !reward.isActive)
      throw new BadRequestException('Reward not available');

    if (student.balance < reward.amount)
      throw new BadRequestException('Insufficient balance');

    const transaction = await this.prisma.$transaction([
      this.prisma.student.update({
        where: { userId: studentId },
        data: { balance: { decrement: reward.amount } },
      }),
      this.prisma.transaction.create({
        data: {
          amount: reward.amount,
          description: `Resgate de: ${reward.name}`,
          type: TransactionType.REWARD,
          studentId: student.id,
          rewardId: reward.id,
        },
      }),
    ]);

    await this.rewardsEmailService.sendStudentRewardEmail(
      student.id,
      student.name,
      student.user.email,
      reward.id,
      reward.name,
      reward.company.name,
    );
    await this.rewardsEmailService.sendCompanyRewardEmail(
      student.name,
      reward.name,
      reward.company.user.email,
      reward.company.name,
      transaction[1].createdAt.toLocaleDateString('pt-BR'),
    );

    return { success: true };
  }

  async getAvailableRewards() {
    return this.prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getInstitutionStudents(teacherId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: teacherId },
    });

    if (!teacher) throw new BadRequestException('Teacher not found');

    const students = await this.prisma.student.findMany({
      where: { institutionId: teacher.institutionId },
      orderBy: { name: 'asc' },
      include: { user: true },
    });

    return students.map((student) => ({
      id: student.userId,
      name: student.name,
      course: student.course,
      email: student.user.email,
    }));
  }
}
