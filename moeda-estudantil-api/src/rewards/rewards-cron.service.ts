// rewards-cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TeachersService } from '../teachers/teachers.service';

@Injectable()
export class RewardsCronService {
  constructor(private teachersService: TeachersService) {}

  @Cron('0 0 1 1,7 *')
  async giveSemesterCoins() {
    const teachers = await this.teachersService.getAllTeachersIds();
    const now = new Date();

    await Promise.all(
      teachers.map((teacher) =>
        this.teachersService.updateTeacherBalance(teacher.id, 1000, now),
      ),
    );
  }
}
