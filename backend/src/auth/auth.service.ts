import { Injectable, ConflictException, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

// Handles user registration, login verification, password hashing, and token issuance.
@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Seeds the initial Admission Team account on system startup if it doesn't already exist.
  async onModuleInit() {
    const adminEmail = 'admin@school.com';
    const existingAdmin = await this.usersService.findByEmail(adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.usersService.create({
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMISSION_TEAM,
        name: 'Admission Team Lead',
      });
      console.log('Seeded default admission team member: admin@school.com / admin123');
    }
  }

  // Registers a new parent account after validating email uniqueness.
  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: Role.PARENT,
    });
    
    return {
      message: 'Registration successful',
      userId: user._id,
    };
  }

  // Authenticates credentials and returns a JWT access token along with user details.
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
