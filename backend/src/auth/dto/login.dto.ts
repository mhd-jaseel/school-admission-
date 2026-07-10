import { IsEmail, IsNotEmpty } from 'class-validator';

// Data transfer object for user login.
// Validates presence of email and password fields.
export class LoginDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
