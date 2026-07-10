'use client';

import { Check, ClipboardList, CreditCard, CalendarDays, Award, CheckCircle } from 'lucide-react';
import styles from './AdmissionStepper.module.css';

interface AdmissionStepperProps {
  currentStatus:
    | 'Application Created'
    | 'Registration Fee Paid'
    | 'Slot Booked'
    | 'Exam Completed'
    | 'Admission Completed';
}

// Renders a progress roadmap for parent applications.
export default function AdmissionStepper({ currentStatus }: AdmissionStepperProps) {
  const steps = [
    { label: 'Created', icon: ClipboardList, key: 'Application Created' },
    { label: 'Fee Paid', icon: CreditCard, key: 'Registration Fee Paid' },
    { label: 'Slot Booked', icon: CalendarDays, key: 'Slot Booked' },
    { label: 'Exam Done', icon: Award, key: 'Exam Completed' },
    { label: 'Completed', icon: CheckCircle, key: 'Admission Completed' },
  ];

  const statusOrder = [
    'Application Created',
    'Registration Fee Paid',
    'Slot Booked',
    'Exam Completed',
    'Admission Completed',
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className={styles.stepper} style={{ position: 'relative' }}>
      {/* Decorative connecting line */}
      <div style={{
        position: 'absolute',
        top: '36px',
        left: '10%',
        right: '10%',
        height: '2px',
        background: 'var(--border-color)',
        zIndex: 1
      }} />
      
      {/* Active progress fill */}
      <div style={{
        position: 'absolute',
        top: '36px',
        left: '10%',
        width: `${(currentIndex / (steps.length - 1)) * 80}%`,
        height: '2px',
        background: 'var(--primary)',
        zIndex: 1,
        transition: 'width 0.4s ease'
      }} />

      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <div
            key={step.key}
            className={`${styles.step} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}
            style={{ zIndex: 2 }}
          >
            <div className={styles.stepIcon}>
              {isCompleted ? <Check size={14} /> : <Icon size={14} />}
            </div>
            <span className={styles.stepLabel}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
