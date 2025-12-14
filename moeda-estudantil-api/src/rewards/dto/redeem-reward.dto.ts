import { IsString, IsNotEmpty } from 'class-validator';

export class RedeemRewardDTO {
  @IsString()
  @IsNotEmpty({ message: 'Reward ID is required' })
  rewardId: string;
}
