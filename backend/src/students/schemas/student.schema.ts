import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApplicationStatus } from '../../common/enums/application-status.enum';

export type StudentDocument = Student & Document;

// Represents the Student Application model in MongoDB.
// Holds details of the applicant, current status, mock fee paid status, score, and assigned course.
@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  previousSchool: string;

  @Prop({ required: true })
  applyingGrade: string;

  @Prop({ required: true })
  parentName: string;

  @Prop({ required: true })
  parentPhone: string;

  @Prop({
    required: true,
    enum: ApplicationStatus,
    default: ApplicationStatus.CREATED,
  })
  status: ApplicationStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  parentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ExamSlot', required: false })
  examSlotId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, min: 0, max: 100 })
  examScore?: number;

  @Prop({ required: false })
  assignedCourse?: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
