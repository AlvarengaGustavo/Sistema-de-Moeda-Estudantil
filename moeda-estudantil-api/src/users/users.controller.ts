import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateStudentDTO } from './dto/create-student-dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetAllStudentsDTO } from './dto/get-all-students.dto';
import { UpdateStudentDTO } from './dto/update-student-dto';
import { CreateCompanyDto } from './dto/create-company-dto';
import { UpdateCompanyDto } from './dto/update-company-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('student')
  createStudent(@Body() createStudentDTO: CreateStudentDTO) {
    return this.usersService.createStudent(createStudentDTO);
  }

  @Put('student/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDTO: UpdateStudentDTO,
  ) {
    return this.usersService.updateStudent(id, updateStudentDTO);
  }

  @Get('student')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getStudents(@Query() query: GetAllStudentsDTO) {
    return this.usersService.getStudents(query.page, query.limit, query.name);
  }

  @Get('student/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getStudentById(@Param('id') id: string) {
    return this.usersService.getStudentById(id);
  }

  @Post('company')
  createCompany(@Body() newCompanyData: CreateCompanyDto) {
    return this.usersService.createCompany(newCompanyData);
  }

  @Get('company')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getCompanies(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
  ) {
    return this.usersService.getCompanies(page, limit, name);
  }

  @Get('company/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getCompanyById(@Param('id') id: string) {
    return this.usersService.getCompanyById(id);
  }

  @Put('company/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDTO: UpdateCompanyDto,
  ) {
    return this.usersService.updateCompany(id, updateCompanyDTO);
  }
}
