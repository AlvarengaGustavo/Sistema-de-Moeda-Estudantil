import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  password: string;
}
