// Represents the official 5 stages of the student application workflow.
// Statuses must change sequentially: Created -> Paid -> Booked -> Score Entered -> Completed.
export enum ApplicationStatus {
  CREATED = 'Application Created',
  PAID = 'Registration Fee Paid',
  BOOKED = 'Slot Booked',
  EXAM_COMPLETED = 'Exam Completed',
  ADMISSION_COMPLETED = 'Admission Completed',
}
