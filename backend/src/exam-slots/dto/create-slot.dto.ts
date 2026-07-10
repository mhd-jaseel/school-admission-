import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

// DTO for creating a predefined exam slot.
export class CreateSlotDto {
  @IsNotEmpty({ message: 'Date is required' })
  @IsString()
  date: string;

  @IsNotEmpty({ message: 'Time is required' })
  @IsString()
  time: string;

  @IsNotEmpty({ message: 'Maximum students is required' })
  @IsInt({ message: 'Maximum students must be a whole number' })
  @Min(1, { message: 'Maximum students must be at least 1' })
  @Max(500, { message: 'Maximum students cannot exceed 500' })
  maxStudents: number;
}
