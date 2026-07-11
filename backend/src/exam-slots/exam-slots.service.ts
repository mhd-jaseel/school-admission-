import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamSlot, ExamSlotDocument } from './schemas/exam-slot.schema';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { CreateSlotDto } from './dto/create-slot.dto';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { Role } from '../common/enums/role.enum';

// Service to manage exam slots creation and bookings.
@Injectable()
export class ExamSlotsService implements OnModuleInit {
  constructor(
    @InjectModel(ExamSlot.name) private slotModel: Model<ExamSlotDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  // Pre-populates the database with some sample slots on initial launch.
  async onModuleInit() {
    const count = await this.slotModel.countDocuments();
    if (count === 0) {
      const defaultSlots = [
        {
          date: '2026-07-15',
          time: '10:00 AM',
          isBooked: false,
          maxStudents: 10,
          bookedCount: 0,
          studentId: null,
        },
        {
          date: '2026-07-15',
          time: '02:00 PM',
          isBooked: false,
          maxStudents: 10,
          bookedCount: 0,
          studentId: null,
        },
        {
          date: '2026-07-16',
          time: '10:00 AM',
          isBooked: false,
          maxStudents: 10,
          bookedCount: 0,
          studentId: null,
        },
      ];
      await this.slotModel.insertMany(defaultSlots);
      console.log('Pre-seeded default exam slots successfully.');
    }
  }

  // Creates a new exam slot (Admission Team only) with validations.
  async create(dto: CreateSlotDto): Promise<ExamSlot> {
    const date = dto.date.trim();
    const time = dto.time.trim();

    // Check duplicate
    const existing = await this.slotModel.findOne({ date, time });
    if (existing) {
      throw new BadRequestException(
        'An exam slot already exists for this date and time',
      );
    }

    // Check date is not in the past
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDate < today) {
        throw new BadRequestException('Exam slot date cannot be in the past');
      }
    }

    return this.slotModel.create({
      date,
      time,
      maxStudents: dto.maxStudents,
      bookedCount: 0,
      isBooked: false,
      studentId: null,
    });
  }

  // Returns all exam slots.
  async findAll(): Promise<ExamSlot[]> {
    return this.slotModel.find().sort({ date: 1, time: 1 }).exec();
  }

  // Links a student application to an exam slot and updates the status to 'Slot Booked'.
  async bookSlot(
    slotId: string,
    userId: string,
    studentId: string,
  ): Promise<Student> {
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student application not found');
    }

    if (student.parentId.toString() !== userId) {
      throw new ForbiddenException('You do not own this student application');
    }

    if (student.status !== ApplicationStatus.PAID) {
      throw new BadRequestException(
        'Student application must be in "Registration Fee Paid" status to book a slot',
      );
    }

    const slot = await this.slotModel.findById(slotId);
    if (!slot) {
      throw new NotFoundException('Exam slot not found');
    }

    if (slot.bookedCount >= slot.maxStudents) {
      throw new BadRequestException(
        'Exam slot is full. Please select another slot.',
      );
    }

    // Increment booked count and mark full if capacity reached
    slot.bookedCount += 1;
    if (slot.bookedCount >= slot.maxStudents) {
      slot.isBooked = true;
    }
    slot.studentId = new Types.ObjectId(studentId) as any;
    await slot.save();

    // Link the slot to student and advance status
    student.examSlotId = new Types.ObjectId(slotId) as any;
    student.status = ApplicationStatus.BOOKED;
    return student.save();
  }
}
