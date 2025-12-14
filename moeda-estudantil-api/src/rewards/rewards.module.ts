import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TeachersModule } from '../teachers/teachers.module';
import { RewardsCronService } from './rewards-cron.service';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { RewardsEmailService } from './rewards-email.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [ScheduleModule.forRoot(), TeachersModule, EmailModule],
  controllers: [RewardsController],
  providers: [RewardsCronService, RewardsService, RewardsEmailService],
  exports: [],
})
export class RewardsModule {}
