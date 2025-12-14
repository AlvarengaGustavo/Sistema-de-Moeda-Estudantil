import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class CreateStudentDTO extends CreateUserDTO {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'CPF must be a string' })
  @IsNotEmpty({ message: 'CPF is required' })
  @Length(11, 11, { message: 'CPF must be 11 characters long' })
  cpf: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsString({ message: 'Course must be a string' })
  @IsNotEmpty({ message: 'Course is required' })
  course: string;

  @IsString({ message: 'Institution ID must be a string' })
  @IsNotEmpty({ message: 'Institution ID is required' })
  institutionId: string;
}
