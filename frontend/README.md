# ABC Academy - Frontend Client

This is the Next.js frontend client for the ABC Academy School Admission Workflow System. It provides an intuitive, responsive interface for parents to apply for admission and book exam slots, and for the admission team to review, grade, and assign courses.

## Overview
Developed using Next.js (App Router), TypeScript, and Vanilla CSS, this client implements a modern, single-page dashboard experience and multi-stage workflows for both parents and administration staff.

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the portal at `http://localhost:3000`.

## Folder Structure

```
frontend/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Login and Registration screens
│   │   ├── admission/      # Admission Lead dashboards and controls
│   │   ├── parent/         # Parent student view and workflow creation
│   │   ├── globals.css     # Global layout and design system variables
│   │   └── page.tsx        # Portal entry redirect page
│   ├── components/         # Reusable presentation components
│   │   ├── Navbar.tsx      # Main branding and navigation headers
│   │   └── AdmissionStepper.tsx # Visual progress tracker
│   ├── context/            # Global React state contexts
│   │   └── AuthContext.tsx # User session, token, and role context
│   └── lib/                # API clients and utility functions
│       ├── api.ts          # Axios-like custom fetch wrappers
│       ├── auth.ts         # JWT localStorage helpers
│       └── types.ts        # Shared TypeScript interface definitions
├── package.json
└── tsconfig.json
```

## Routing
The project leverages Next.js App Router structure:
- `/` - Landing redirect
- `/login` - Portal entrance page
- `/register` - Parent signup page
- `/parent/dashboard` - Parents' student list
- `/parent/students/create` - Student Admission Application form
- `/parent/students/[id]` - Detailed student status page, fee payment & exam slot booking
- `/admission/dashboard` - Staff Control Panel stats & exam slot scheduler
- `/admission/applications` - Master applicants list & filters
- `/admission/applications/[id]/update-score` - Exam score updater page
- `/admission/applications/[id]/assign-course` - Final grade assignment page

## Components
- **Navbar**: Renders role-specific actions (e.g. Control Panel link for staff, Dashboard link for parents) and displays authenticated user cards.
- **AdmissionStepper**: Custom progress tracker mapping statuses (Application Created, Registration Fee Paid, Slot Booked, Exam Completed, Admission Completed) to steps with completion metrics.
- **ApplicationsTable**: Multi-filter control list showing candidate cards, scores, and status flags.
- **ExamSlotsSidebar**: Inline exam slot creator with date picking, time slot regex validation, and capacity tracking.

## Context
- **AuthContext**: Manages login/registration state, checks JWT validity on startup, decodes payload info, and provides route-protection triggers.

## Styling
Written in Vanilla CSS utilizing css custom properties (`variables` in `globals.css`):
- Vibrant, tailored color palettes.
- Card elements with soft border radii and shadows.
- Clear error borders for failed validation states.
- Fully responsive styling for both desktop and mobile screens.
