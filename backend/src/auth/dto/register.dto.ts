import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Data transfer object for user registration.
// Validates incoming parent registration fields.
export class RegisterDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;
}
