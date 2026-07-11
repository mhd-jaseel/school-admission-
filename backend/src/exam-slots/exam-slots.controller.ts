import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExamSlotsService } from './exam-slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { BookSlotDto } from './dto/book-slot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

// Exposes API endpoints for viewing and booking exam slots.
@Controller('exam-slots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamSlotsController {
  constructor(private readonly slotsService: ExamSlotsService) {}

  // Creates a new exam slot (Admission Team only).
  @Post()
  @Roles(Role.ADMISSION_TEAM)
  async create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(createSlotDto);
  }

  // Lists all available (unbooked) exam slots.
  @Get()
  async findAll() {
    return this.slotsService.findAll();
  }

  // Books a slot for a specific student application.
  @Post(':id/book')
  @Roles(Role.PARENT)
  @HttpCode(HttpStatus.OK)
  async bookSlot(
    @Param('id') id: string,
    @Request() req,
    @Body() bookSlotDto: BookSlotDto,
  ) {
    return this.slotsService.bookSlot(id, req.user.sub, bookSlotDto.studentId);
  }
}
