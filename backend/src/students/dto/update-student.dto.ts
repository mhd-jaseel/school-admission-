import { IsNotEmpty, IsString, IsISO8601 } from 'class-validator';

// Validates parameters needed to update an existing student application.
export class UpdateStudentDto {
  @IsNotEmpty({ message: 'Student name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsISO8601({}, { message: 'Date of birth must be a valid date (YYYY-MM-DD)' })
  dob: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsString()
  gender: string;

  @IsNotEmpty({ message: 'Previous school name is required' })
  @IsString()
  previousSchool: string;

  @IsNotEmpty({ message: 'Applying grade is required' })
  @IsString()
  applyingGrade: string;

  @IsNotEmpty({ message: 'Parent name is required' })
  @IsString()
  parentName: string;

  @IsNotEmpty({ message: 'Parent phone number is required' })
  @IsString()
  parentPhone: string;
}
