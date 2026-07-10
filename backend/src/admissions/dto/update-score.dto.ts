import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

// Validates the score payload to ensure numeric mark is between 0 and 100.
export class UpdateScoreDto {
  @IsNotEmpty({ message: 'Exam score is required' })
  @IsNumber()
  @Min(0, { message: 'Exam score must be at least 0' })
  @Max(100, { message: 'Exam score cannot exceed 100' })
  score: number;
}
