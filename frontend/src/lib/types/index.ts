// Shared TypeScript interfaces and types for the application.

export type RoleType = 'parent' | 'admission_team';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: RoleType;
}

export type ApplicationStatus =
  | 'Application Created'
  | 'Registration Fee Paid'
  | 'Slot Booked'
  | 'Exam Completed'
  | 'Admission Completed';

export interface ExamSlot {
  _id: string;
  date: string;
  time: string;
  isBooked: boolean;
  maxStudents: number;
  bookedCount: number;
  studentId?: string | null;
}

export interface Student {
  _id: string;
  name: string;
  dob: string;
  gender: string;
  previousSchool: string;
  applyingGrade: string;
  parentName: string;
  parentPhone: string;
  status: ApplicationStatus;
  parentId: string | { _id: string; name: string; email: string; phone?: string };
  examSlotId?: ExamSlot;
  examScore?: number;
  assignedCourse?: string;
  createdAt: string;
  updatedAt: string;
}
