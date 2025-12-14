import { Module } from '@nestjs/common';
import { CompanyRewardsController } from './company-rewards.controller';
import { CompanyRewardsService } from './company-rewards.service';

@Module({
  controllers: [CompanyRewardsController],
  providers: [CompanyRewardsService],
})
export class CompanyRewardsModule {}
