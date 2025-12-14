import {
  Controller,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CompanyRewardsService } from './company-rewards.service';
import { CreateRewardDTO } from './dto/create-reward.dto';
import { UpdateRewardDTO } from './dto/update-reward.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtPayloadDTO } from 'src/auth/dto/jwt-payload.dto';

@Controller('company/rewards')
@UseGuards(AuthGuard, RolesGuard)
@Roles('COMPANY')
export class CompanyRewardsController {
  constructor(private readonly rewardsService: CompanyRewardsService) {}

  @Post()
  async create(
    @Req() req: { user: JwtPayloadDTO },
    @Body() dto: CreateRewardDTO,
  ) {
    return this.rewardsService.createReward(req.user.sub, dto);
  }

  @Patch(':id')
  async update(
    @Req() req: { user: JwtPayloadDTO },
    @Param('id') id: string,
    @Body() dto: UpdateRewardDTO,
  ) {
    return this.rewardsService.updateReward(req.user.sub, id, dto);
  }

  @Get()
  async list(@Req() req: { user: JwtPayloadDTO }) {
    return this.rewardsService.listRewards(req.user.sub);
  }
}
