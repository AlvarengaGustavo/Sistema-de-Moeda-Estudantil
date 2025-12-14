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
import { TeachersService } from './teachers.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateTeacherDTO } from './dto/create-teacher-dto';
import { UpdateTeacherDTO } from './dto/update-teacher-dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  createTeacher(@Body() createTeacherDTO: CreateTeacherDTO) {
    return this.teachersService.createTeacher(createTeacherDTO);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getTeachers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
  ) {
    return this.teachersService.getTeachers(page, limit, name);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getTeacherById(@Param('id') id: string) {
    return this.teachersService.getTeacherById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDTO: UpdateTeacherDTO,
  ) {
    return this.teachersService.updateTeacher(id, updateTeacherDTO);
  }
}
