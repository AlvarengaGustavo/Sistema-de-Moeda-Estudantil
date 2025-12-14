import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { RewardsModule } from './rewards/rewards.module';
import { CompanyRewardsModule } from './company-rewards/company-rewards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    InstitutionsModule,
    TeachersModule,
    RewardsModule,
    CompanyRewardsModule,
  ],
})
export class AppModule {}
