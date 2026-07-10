import { IsNotEmpty, IsString, IsIn } from 'class-validator';

// Validates the course payload to ensure one of the fixed grade courses is selected.
export class AssignCourseDto {
  @IsNotEmpty({ message: 'Course selection is required' })
  @IsString()
  @IsIn(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'], {
    message: 'Course must be either Grade 1, Grade 2, Grade 3, or Grade 4',
  })
  course: string;
}
