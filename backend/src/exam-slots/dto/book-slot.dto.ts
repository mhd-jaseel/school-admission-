import { IsNotEmpty, IsString } from 'class-validator';

// DTO for booking a slot. Passes the ID of the student application to link it.
export class BookSlotDto {
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsString()
  studentId: string;
}
