import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class CreateCompanyDto extends CreateUserDTO {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'CNPJ must be a string' })
  @IsNotEmpty({ message: 'CNPJ is required' })
  @Length(14, 14, { message: 'CNPJ must be 14 characters long' })
  cnpj: string;
}
