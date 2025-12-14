import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateRewardDTO {
  @IsString()
  @IsNotEmpty({ message: 'Reward name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Reward description is required' })
  description: string;

  @IsInt({ message: 'Reward cost must be an integer' })
  @Min(1, { message: 'Reward cost must be at least 1' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Reward image URL is required' })
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
