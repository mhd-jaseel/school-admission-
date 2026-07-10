import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { UpdateScoreDto } from './dto/update-score.dto';
import { AssignCourseDto } from './dto/assign-course.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

// Handles admissions processing requests (admission team only).
@Controller('admissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMISSION_TEAM)
export class AdmissionsController {
  constructor(private readonly admissionService: AdmissionsService) {}

  // Retrieves all student applications in the system.
  @Get()
  async getApplications() {
    return this.admissionService.getApplications();
  }

  // Updates the exam score of a student application.
  @Patch(':id/exam-score')
  async updateScore(@Param('id') id: string, @Body() dto: UpdateScoreDto) {
    return this.admissionService.updateScore(id, dto.score);
  }

  // Assigns a grade course to a student application.
  @Patch(':id/course')
  async assignCourse(@Param('id') id: string, @Body() dto: AssignCourseDto) {
    return this.admissionService.assignCourse(id, dto.course);
  }
}
