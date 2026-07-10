# ABC Academy School Admission Workflow System

An automated school admission workflow system designed as an Interview Assessment project. It coordinates processes between Parents registering children and the School Admission Team leads reviewing, grading, and assigning courses to applicants.

## Project Overview
This project streamlines the typical school enrollment journey into a single, automated, step-by-step workflow. Parents sign up, input applicant details, settle mock fees, and book entrance exam timings. The School Admission team reviews applicants on a dashboard, publishes exam results, and finalizes class admissions.

## Features
- **User Authentication**: Dynamic role-based login and registration for Parents and Admission Staff.
- **Parent Registration**: Simple, professional registration forms.
- **Student Admission**: Profile editor for child information.
- **Document Upload**: (Mocked) documents review and attachment support.
- **Fee Payment (Dummy)**: Integrated SweetAlert payment modals confirming mock fees ($100).
- **Exam Slot Booking**: Live exam scheduler checking slot capacities and booking slots.
- **Dashboard**: Professional control panels displaying metrics and charts.
- **Protected Routes**: Custom guards restricting routes to authorized roles.
- **JWT Authentication**: Secure stateless token authentication.
- **MongoDB Database**: Scalable database storing users, student documents, and slot records.

## Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Vanilla CSS
- **Backend**: NestJS, TypeScript, Mongoose
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs

## Folder Structure
```
school-admission-workflow/
├── backend/            # NestJS API microservice
│   ├── src/            # Controllers, modules, and mongoose schemas
│   └── package.json
├── frontend/           # Next.js client application
│   ├── src/            # Next.js pages, contexts, components
│   └── package.json
├── .gitignore          # Root ignore patterns
└── README.md           # Main documentation
```

## Installation

### Backend
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Run server:
   ```bash
   npm run start:dev
   ```

### Frontend
1. Navigate to frontend:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env` file in the `backend/` folder:
- `PORT`: Server API port (e.g. `3001`).
- `MONGODB_URI`: Connection string to MongoDB instance.
- `JWT_SECRET`: Token signature key.
- `JWT_EXPIRES`: Lifetime of tokens (e.g. `24h`).

## API Overview
- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **Admissions**: Staff grading and course assignments.
- **Parents**: Application creations and details inline editor.
- **Exam Slots**: Live slot booking and capacities.

## Future Improvements
- **Real Payment Gateways**: Integrate Stripe or PayPal API workflows.
- **PDF Receipt Downloads**: Implement PDF generation for paid transaction receipts.
- **S3 Document Uploads**: True file storage handling for student school transcript PDFs.
- **Email Notifications**: Automatic booking notifications using AWS SES/Nodemailer.

## Author
Mohammed Jaseel
