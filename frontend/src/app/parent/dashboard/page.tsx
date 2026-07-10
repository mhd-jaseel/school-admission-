'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import { Plus, Users, Award, GraduationCap, ArrowRight } from 'lucide-react';
import { Student } from '../../../lib/types';
import { studentApi } from '../../../lib/api';
import styles from './dashboard.module.css';

// Dashboard page displaying a list of all application cards filed by the logged-in Parent.
export default function ParentDashboard() {
  const { user, loading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  // Route guard: only allow parents on this page.
  useEffect(() => {
    if (!loading && (!user || user.role !== 'parent')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'parent') {
      fetchStudents();
    }
  }, [user]);

  // Fetches student applications belonging to the parent.
  const fetchStudents = async () => {
    try {
      const data = await studentApi.list();
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        setStudents([]);
      }
    } catch (e) {
      console.error(e);
      setStudents([]);
    } finally {
      setFetching(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Application Created':
        return 'badge-created';
      case 'Registration Fee Paid':
        return 'badge-paid';
      case 'Slot Booked':
        return 'badge-booked';
      case 'Exam Completed':
        return 'badge-exam';
      case 'Admission Completed':
        return 'badge-completed';
      default:
        return '';
    }
  };

  if (loading || fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />

      <main className="dashboard-wrapper">
        <div className="page-header">
          <div>
            <h1 className="page-title">Parent Dashboard</h1>
            <p className="page-subtitle">Manage and track your child's applications</p>
          </div>
          <Link href="/parent/students/create" className="btn btn-primary">
            <Plus size={18} />
            <span>New Application</span>
          </Link>
        </div>

        {!students || !Array.isArray(students) || students.length === 0 ? (
          <div className="empty-state">
            <Users size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
            <h3>No Active Applications</h3>
            <p style={{ marginBottom: '24px' }}>Get started by creating a new student admission application.</p>
            <Link href="/parent/students/create" className="btn btn-primary">
              Create Student Application
            </Link>
          </div>
        ) : (
          <div className={styles.studentsGrid}>
            {students.map((student) => (
              <div key={student._id} className={styles.studentCard}>
                <div className={styles.studentCardHeader}>
                  <div>
                    <h3 className={styles.studentName}>{student.name}</h3>
                    <span className={styles.studentGrade}>Applying: {student.applyingGrade}</span>
                  </div>
                  <span className={`student-status-badge ${getStatusClass(student.status)}`}>
                    {student.status}
                  </span>
                </div>

                <div className={styles.studentDetailsList}>
                  <div className={styles.studentDetailsItem}>
                    <span className={styles.studentDetailsLabel}>Date of Birth:</span>
                    <span>{student.dob}</span>
                  </div>
                  <div className={styles.studentDetailsItem}>
                    <span className={styles.studentDetailsLabel}>Gender:</span>
                    <span>{student.gender}</span>
                  </div>
                  <div className={styles.studentDetailsItem}>
                    <span className={styles.studentDetailsLabel}>Previous School:</span>
                    <span>{student.previousSchool}</span>
                  </div>
                  
                  {student.examScore !== undefined && (
                    <div className={styles.studentDetailsItem} style={{ borderTop: '1px dashed var(--panel-border)', paddingTop: '8px', marginTop: '4px' }}>
                      <span className={styles.studentDetailsLabel} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Award size={14} style={{ color: '#c084fc' }} /> Exam Score:
                      </span>
                      <span style={{ fontWeight: '700', color: '#c084fc' }}>{student.examScore}/100</span>
                    </div>
                  )}

                  {student.assignedCourse && (
                    <div className={styles.studentDetailsItem}>
                      <span className={styles.studentDetailsLabel} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <GraduationCap size={14} style={{ color: '#34d399' }} /> Course/Grade:
                      </span>
                      <span style={{ fontWeight: '700', color: '#34d399' }}>{student.assignedCourse}</span>
                    </div>
                  )}
                </div>

                <div className={styles.studentCardActions}>
                  <Link href={`/parent/students/${student._id}`} className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <span>View application</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
