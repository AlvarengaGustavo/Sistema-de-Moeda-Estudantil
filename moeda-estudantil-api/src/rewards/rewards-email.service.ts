import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { getCompanyRewardEmail } from 'src/email/templates/company-reward-email';
import { getStudentDonationEmail } from 'src/email/templates/student-donation-email';
import { getStudentRewardEmail } from 'src/email/templates/student-reward-email';
import { getTeacherDonationEmail } from 'src/email/templates/teacher-donation-email';

@Injectable()
export class RewardsEmailService {
  constructor(private readonly emailService: EmailService) {}

  async sendStudentRewardEmail(
    studentId: string,
    studentName: string,
    studentEmail: string,
    rewardId: string,
    rewardName: string,
    companyName: string,
  ) {
    const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(`resgate:${studentId}:${rewardId}`)}&size=180`;

    const email = getStudentRewardEmail(
      studentName,
      qrCodeUrl,
      rewardName,
      companyName,
    );

    await this.emailService.sendEmail(
      studentEmail,
      'Seu Resgate de Vantagem',
      email,
    );
  }

  async sendCompanyRewardEmail(
    studentName: string,
    rewardName: string,
    companyEmail: string,
    companyName: string,
    date: string,
  ) {
    const email = getCompanyRewardEmail(
      studentName,
      rewardName,
      companyName,
      date,
    );

    await this.emailService.sendEmail(
      companyEmail,
      'Resgate de Vantagem Recebido',
      email,
    );
  }

  async sendStudentDonationEmail(
    studentName: string,
    teacherName: string,
    studentEmail: string,
    quantity: number,
    reason: string,
  ) {
    const email = getStudentDonationEmail(
      studentName,
      teacherName,
      quantity,
      reason,
    );

    await this.emailService.sendEmail(
      studentEmail,
      'Você recebeu uma doação!',
      email,
    );
  }

  async sendTeacherDonationEmail(
    studentName: string,
    teacherName: string,
    teacherEmail: string,
    quantity: number,
    reason: string,
  ) {
    const email = getTeacherDonationEmail(
      studentName,
      teacherName,
      quantity,
      reason,
    );

    await this.emailService.sendEmail(teacherEmail, 'Doação enviada!', email);
  }
}
