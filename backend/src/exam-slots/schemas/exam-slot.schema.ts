import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExamSlotDocument = ExamSlot & Document;

// Schema for exam slots. Track date, time, whether it is booked, and which student booked it.
@Schema({ timestamps: true })
export class ExamSlot {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, default: false })
  isBooked: boolean;

  @Prop({ required: true, default: 10 })
  maxStudents: number;

  @Prop({ required: true, default: 0 })
  bookedCount: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Student',
    required: false,
    default: null,
  })
  studentId?: MongooseSchema.Types.ObjectId | null;
}

export const ExamSlotSchema = SchemaFactory.createForClass(ExamSlot);
