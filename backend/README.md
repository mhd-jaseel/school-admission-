# ABC Academy - Backend API Service

This is the NestJS backend API service for the ABC Academy School Admission Workflow System. It handles data models, user registration/login, JWT authentication, role guards, exam slot bookings, and student grade assignments.

## Overview
Built with NestJS, Mongoose, and MongoDB, this service enforces server-side validation using `class-validator`, secures route requests using custom NestJS Guards, and pre-seeds default slots on database startup.

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (see below).
4. Run the development server:
   ```bash
   npm run start:dev
   ```

## Environment Variables
Create a `.env` file in the `backend` directory matching the following variables:

```env
PORT=3001                                            # API port (default: 3001)
MONGODB_URI=mongodb://127.0.0.1:27017/school-admission # MongoDB Connection URL
JWT_SECRET=supersecretjwtkey987654321                # Secret signature key for JWT tokens
JWT_EXPIRES=24h                                      # JWT Token expiration span
```

## Scripts
- `npm run start:dev` - Launches NestJS with watch-mode enabled.
- `npm run build` - Compiles NestJS application into production code under `dist/`.
- `npm run start:prod` - Runs the compiled application.
- `npm run lint` - Runs eslint check over codebase.

## API Modules
- **AuthModule**: Handles user login, password hashing via `bcryptjs`, and registration endpoints.
- **StudentsModule**: Performs CRUD on student applications, manages states, and handles mock fee payments.
- **ExamSlotsModule**: Manages creating and booking exam slots, including capacity limit enforcement.
- **AdmissionsModule**: Exposes endpoints for the admission team to update scores and assign courses.

## Folder Structure

```
backend/
├── src/
│   ├── auth/               # Auth controllers, services, guards, and DTOs
│   ├── students/           # Student schemas, controllers, services, and DTOs
│   ├── exam-slots/         # Predefined exam slots, bookings, and capacities
│   ├── admissions/         # Staff controllers, course assignment, and updates
│   ├── common/             # Global filters, guards, and status enums
│   ├── app.module.ts       # Application root module declaration
│   └── main.ts             # Application bootstrapper and global pipes
├── package.json
└── tsconfig.json
```
