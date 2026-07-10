import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { Role } from '../common/enums/role.enum';

// Contains business logic for managing student applications (create, read, update).
@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  // Creates a new student application under a parent's ID with the initial stage.
  async create(userId: string, dto: CreateStudentDto): Promise<Student> {
    const student = await this.studentModel.create({
      ...dto,
      parentId: userId as any,
      status: ApplicationStatus.CREATED,
    });
    return student;
  }

  // Updates an application only if it is still in the 'Application Created' stage.
  async update(
    studentId: string,
    userId: string,
    userRole: string,
    dto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student application not found');
    }

    if (userRole === Role.PARENT && student.parentId.toString() !== userId) {
      throw new ForbiddenException('You do not own this student application');
    }

    if (student.status !== ApplicationStatus.CREATED) {
      throw new BadRequestException('Cannot edit application details after registration fee has been paid');
    }

    Object.assign(student, dto);
    return student.save();
  }

  // Fetches a single student application, checking permission based on user role.
  async findOne(studentId: string, userId: string, userRole: string): Promise<Student> {
    const student = await this.studentModel.findById(studentId).populate('examSlotId');
    if (!student) {
      throw new NotFoundException('Student application not found');
    }

    if (userRole === Role.PARENT && student.parentId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this student application');
    }

    return student;
  }

  // Retrieves all student applications. Parents see only theirs, admission team sees all.
  async findAll(userId: string, userRole: string): Promise<Student[]> {
    if (userRole === Role.ADMISSION_TEAM) {
      return this.studentModel.find().populate('examSlotId').sort({ createdAt: -1 });
    }
    return this.studentModel.find({ parentId: userId as any }).populate('examSlotId').sort({ createdAt: -1 });
  }

  // Completes mock payment for registration fee and transitions status to Registration Fee Paid.
  async payRegistrationFee(studentId: string, userId: string): Promise<Student> {
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student application not found');
    }

    if (student.parentId.toString() !== userId) {
      throw new ForbiddenException('You do not own this student application');
    }

    if (student.status !== ApplicationStatus.CREATED) {
      throw new BadRequestException('Registration fee already paid or application has advanced');
    }

    student.status = ApplicationStatus.PAID;
    return student.save();
  }
}
