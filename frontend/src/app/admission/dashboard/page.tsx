'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import StatsGrid from './components/StatsGrid';
import ExamSlotsSidebar from './components/ExamSlotsSidebar';
import ApplicationsTable from './components/ApplicationsTable';
import { Student, ExamSlot } from '../../../lib/types';
import { admissionApi, examSlotApi } from '../../../lib/api';
import { FileText } from 'lucide-react';
import styles from './dashboard.module.css';

// Main dashboard landing page for the Admission Team role. Hosts quick statistics and slot creator form.
export default function AdmissionDashboard() {
  const { user, loading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [slotMaxStudents, setSlotMaxStudents] = useState('10');
  const [addingSlot, setAddingSlot] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [slotSuccess, setSlotSuccess] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admission_team')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admission_team') {
      loadDashboardData();
    }
  }, [user]);

  // Fetches initial list of students and slot models.
  const loadDashboardData = async () => {
    try {
      const studentsData = await admissionApi.list();
      setStudents(Array.isArray(studentsData) ? studentsData : []);

      const slotsData = await examSlotApi.listAvailable();
      setSlots(Array.isArray(slotsData) ? slotsData : []);
    } catch (e) {
      console.error(e);
      setStudents([]);
      setSlots([]);
    } finally {
      setFetching(false);
    }
  };

  // Triggers creation of a new exam slot.
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlotError(null);
    setSlotSuccess(null);

    const dateTrim = slotDate.trim();
    const timeTrim = slotTime.trim();
    const maxStudentsTrim = slotMaxStudents.trim();

    if (!dateTrim) {
      setSlotError('Date is required');
      return;
    }
    const parsedDate = new Date(dateTrim);
    if (!isNaN(parsedDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDate < today) {
        setSlotError('Exam slot date cannot be in the past');
        return;
      }
    }

    if (!timeTrim) {
      setSlotError('Time slot is required');
      return;
    }
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    const time24Regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(timeTrim) && !time24Regex.test(timeTrim)) {
      setSlotError('Time slot must follow a valid format (e.g. 10:00 AM or 14:00)');
      return;
    }

    const maxVal = parseInt(maxStudentsTrim, 10);
    if (!maxStudentsTrim) {
      setSlotError('Maximum students is required');
      return;
    }
    if (isNaN(maxVal) || maxVal <= 0) {
      setSlotError('Maximum students must be a positive whole number greater than 0');
      return;
    }
    if (maxVal > 500) {
      setSlotError('Maximum students cannot exceed 500');
      return;
    }

    setAddingSlot(true);
    try {
      const token = localStorage.getItem('school_admission_token');
      const res = await fetch('http://localhost:3001/api/exam-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          date: dateTrim, 
          time: timeTrim, 
          maxStudents: maxVal 
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create slot');
      }

      setSlotDate('');
      setSlotTime('');
      setSlotMaxStudents('10');
      setSlotSuccess('Exam slot created successfully!');
      setTimeout(() => setSlotSuccess(null), 4000);
      
      const slotsData = await examSlotApi.listAvailable();
      setSlots(Array.isArray(slotsData) ? slotsData : []);
    } catch (err: any) {
      setSlotError(err.message || 'Failed to create slot');
    } finally {
      setAddingSlot(false);
    }
  };

  // Local inline calculations for realtime UI state
  const timeRegexVal = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  const time24RegexVal = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  const dateObj = new Date(slotDate);
  const todayObj = new Date();
  todayObj.setHours(0, 0, 0, 0);

  const dateErr = !slotDate ? 'Date is required' : (!isNaN(dateObj.getTime()) && dateObj < todayObj ? 'Date cannot be in the past' : null);
  const timeErr = !slotTime ? 'Time slot is required' : (!timeRegexVal.test(slotTime.trim()) && !time24RegexVal.test(slotTime.trim()) ? 'Invalid time format' : null);
  const maxStudentsVal = parseInt(slotMaxStudents, 10);
  const maxStudentsErr = !slotMaxStudents ? 'Maximum students is required' : (isNaN(maxStudentsVal) || maxStudentsVal <= 0 ? 'Must be a positive whole number' : (maxStudentsVal > 500 ? 'Maximum 500 capacity' : null));

  const isFormValid = slotDate.trim().length > 0 && slotTime.trim().length > 0 && slotMaxStudents.trim().length > 0 && !dateErr && !timeErr && !maxStudentsErr;

  // Calculate statistics defensively
  const stats = {
    total: Array.isArray(students) ? students.length : 0,
    paid: Array.isArray(students) ? students.filter((s) => s && s.status !== 'Application Created').length : 0,
    booked: Array.isArray(students) ? students.filter((s) => s && ['Slot Booked', 'Exam Completed', 'Admission Completed'].includes(s.status)).length : 0,
    completed: Array.isArray(students) ? students.filter((s) => s && s.status === 'Admission Completed').length : 0,
  };

  if (loading || fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Loading Control Panel...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />

      <main className="dashboard-wrapper">
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="page-title">Admission Team Control Panel</h1>
            <p className="page-subtitle">Process applicant stages, scores, and course assignments</p>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        <div className={styles.detailLayout}>
          {/* Applications list table */}
          <ApplicationsTable students={students} limit={5} showViewAllLink={true} />

          {/* Exam Slot creator sidebar */}
          <ExamSlotsSidebar
            slots={slots}
            slotDate={slotDate}
            setSlotDate={setSlotDate}
            slotTime={slotTime}
            setSlotTime={setSlotTime}
            slotMaxStudents={slotMaxStudents}
            setSlotMaxStudents={setSlotMaxStudents}
            addingSlot={addingSlot}
            slotError={slotError}
            slotSuccess={slotSuccess}
            handleAddSlot={handleAddSlot}
            dateErr={slotDate ? dateErr : null}
            timeErr={slotTime ? timeErr : null}
            maxStudentsErr={slotMaxStudents ? maxStudentsErr : null}
            isFormValid={isFormValid}
          />
        </div>
      </main>
    </div>
  );
}
