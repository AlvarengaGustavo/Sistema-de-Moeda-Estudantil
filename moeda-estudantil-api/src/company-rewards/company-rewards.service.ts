import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRewardDTO } from './dto/create-reward.dto';
import { UpdateRewardDTO } from './dto/update-reward.dto';

@Injectable()
export class CompanyRewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReward(companyId: string, dto: CreateRewardDTO) {
    return this.prisma.reward.create({
      data: {
        ...dto,
        company: { connect: { userId: companyId } },
      },
    });
  }

  async updateReward(
    companyId: string,
    rewardId: string,
    dto: UpdateRewardDTO,
  ) {
    const company = await this.prisma.company.findUnique({
      where: { userId: companyId },
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }

    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || reward.companyId !== company.id) {
      throw new BadRequestException('Reward not found');
    }

    return this.prisma.reward.update({
      where: { id: rewardId },
      data: dto,
    });
  }

  async listRewards(userId: string) {
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }

    return this.prisma.reward.findMany({ where: { companyId: company.id } });
  }
}
