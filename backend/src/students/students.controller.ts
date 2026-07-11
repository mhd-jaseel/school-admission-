import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

// Directs HTTP traffic for student registration and details.
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // Registers a student application (Parents only).
  @Post()
  @Roles(Role.PARENT)
  async create(@Request() req, @Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(req.user.sub, createStudentDto);
  }

  // Updates application details prior to fee payment (Parents only).
  @Patch(':id')
  @Roles(Role.PARENT)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(
      id,
      req.user.sub,
      req.user.role,
      updateStudentDto,
    );
  }

  // Gets detailed data of a specific student application.
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.studentsService.findOne(id, req.user.sub, req.user.role);
  }

  // Lists all students applying (filtered by Parent owner or full list for Admission Team).
  @Get()
  async findAll(@Request() req) {
    return this.studentsService.findAll(req.user.sub, req.user.role);
  }

  // Completes the mock registration fee payment for a student application.
  @Post(':id/registration-fee')
  @Roles(Role.PARENT)
  async payRegistrationFee(@Param('id') id: string, @Request() req) {
    return this.studentsService.payRegistrationFee(id, req.user.sub);
  }
}
