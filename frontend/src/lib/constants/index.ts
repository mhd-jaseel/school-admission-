import { ApplicationStatus } from '../types';

// System constants for validation and dropdown lists.

// Fixed list of grade courses that can be assigned by the Admission Team.
export const COURSE_LIST = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'];

// Ordered list of application statuses for workflow tracking.
export const STATUS_FLOW: ApplicationStatus[] = [
  'Application Created',
  'Registration Fee Paid',
  'Slot Booked',
  'Exam Completed',
  'Admission Completed',
];
