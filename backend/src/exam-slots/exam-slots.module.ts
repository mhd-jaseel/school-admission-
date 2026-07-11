import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSlot, ExamSlotSchema } from './schemas/exam-slot.schema';
import { ExamSlotsService } from './exam-slots.service';
import { ExamSlotsController } from './exam-slots.controller';
import { StudentsModule } from '../students/students.module';

// Assembles exam slot features, registering model schemas and controllers.
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamSlot.name, schema: ExamSlotSchema },
    ]),
    StudentsModule,
  ],
  controllers: [ExamSlotsController],
  providers: [ExamSlotsService],
  exports: [ExamSlotsService],
})
export class ExamSlotsModule {}
