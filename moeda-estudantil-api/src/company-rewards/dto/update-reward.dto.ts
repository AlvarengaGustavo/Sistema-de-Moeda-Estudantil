import { IsString, IsInt, Min, IsOptional, IsBoolean } from 'class-validator';

export class UpdateRewardDTO {
  @IsString({ message: 'Reward name must be a string' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Reward description must be a string' })
  @IsOptional()
  description?: string;

  @IsInt({ message: 'Reward cost must be an integer' })
  @Min(1, { message: 'Reward cost must be at least 1' })
  @IsOptional()
  amount?: number;

  @IsString({ message: 'Reward image URL must be a string' })
  @IsOptional()
  imageUrl?: string;

  @IsBoolean({ message: 'isActive must be boolean' })
  @IsOptional()
  isActive?: boolean;
}
