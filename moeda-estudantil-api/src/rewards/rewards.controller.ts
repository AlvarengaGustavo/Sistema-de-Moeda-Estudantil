import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { DonateCoinsDTO } from './dto/donate-coins.dto';
import { RedeemRewardDTO } from './dto/redeem-reward.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtPayloadDTO } from 'src/auth/dto/jwt-payload.dto';

@Controller('rewards')
@UseGuards(AuthGuard, RolesGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post('donate')
  @Roles('TEACHER')
  async donate(
    @Req() req: { user: JwtPayloadDTO },
    @Body() dto: DonateCoinsDTO,
  ) {
    const teacherId = req.user.sub;
    return this.rewardsService.donateCoins(teacherId, dto);
  }

  @Get('transactions')
  @Roles('TEACHER', 'STUDENT', 'COMPANY')
  async getTransactions(@Req() req: { user: JwtPayloadDTO }) {
    const userId = req.user.sub;
    return this.rewardsService.getTransactions(userId, req.user.role);
  }

  @Post('redeem')
  @Roles('STUDENT')
  async redeem(
    @Req() req: { user: JwtPayloadDTO },
    @Body() dto: RedeemRewardDTO,
  ) {
    const studentId = req.user.sub;
    return this.rewardsService.redeemReward(studentId, dto.rewardId);
  }

  @Get()
  @Roles('STUDENT')
  async getAvailableRewards() {
    return this.rewardsService.getAvailableRewards();
  }

  @Get('institution-students')
  @Roles('TEACHER')
  async getInstitutionStudents(@Req() req: { user: JwtPayloadDTO }) {
    const teacherId = req.user.sub;
    return this.rewardsService.getInstitutionStudents(teacherId);
  }
}
