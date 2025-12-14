import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class DonateCoinsDTO {
  @IsString()
  @IsNotEmpty({ message: 'Student ID is required' })
  studentId: string;

  @IsInt({ message: 'Amount must be an integer' })
  @Min(1, { message: 'Donation amount must be at least 1' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Reason is required' })
  reason: string;
}
