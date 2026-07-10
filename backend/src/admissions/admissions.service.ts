import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { ApplicationStatus } from '../common/enums/application-status.enum';

// Service to manage applicant score entry and course assignment.
@Injectable()
export class AdmissionsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  // Retrieves all student applications with parent details populated (Admission Team access).
  async getApplications(): Promise<Student[]> {
    return this.studentModel
      .find()
      .populate('examSlotId')
      .populate('parentId', 'name email phone')
      .sort({ createdAt: -1 });
  }

  // Updates the student's exam score (0-100) and advances status to 'Exam Completed'.
  async updateScore(studentId: string, score: number): Promise<Student> {
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student application not found');
    }

    const validStatuses = [
      ApplicationStatus.BOOKED,
      ApplicationStatus.EXAM_COMPLETED,
      ApplicationStatus.ADMISSION_COMPLETED,
    ];
    if (!validStatuses.includes(student.status)) {
      throw new BadRequestException('Exam score can only be updated after a slot is booked');
    }

    student.examScore = score;
    if (student.status === ApplicationStatus.BOOKED) {
      student.status = ApplicationStatus.EXAM_COMPLETED;
    }
    return student.save();
  }

  // Assigns a grade level course and completes the workflow (status becomes 'Admission Completed').
  async assignCourse(studentId: string, course: string): Promise<Student> {
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student application not found');
    }

    const validStatuses = [
      ApplicationStatus.EXAM_COMPLETED,
      ApplicationStatus.ADMISSION_COMPLETED,
    ];
    if (!validStatuses.includes(student.status)) {
      throw new BadRequestException('Course can only be assigned after exam is completed');
    }

    student.assignedCourse = course;
    if (student.status === ApplicationStatus.EXAM_COMPLETED) {
      student.status = ApplicationStatus.ADMISSION_COMPLETED;
    }
    return student.save();
  }
}
