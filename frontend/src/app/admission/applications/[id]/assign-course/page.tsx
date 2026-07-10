'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../../context/AuthContext';
import Navbar from '../../../../../components/Navbar';
import { ChevronLeft, Save, AlertCircle } from 'lucide-react';
import { Student } from '../../../../../lib/types';
import { studentApi, admissionApi } from '../../../../../lib/api';
import { COURSE_LIST } from '../../../../../lib/constants';

// Page for selecting and assigning a grade course to the student application.
export default function AssignCourse({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const { user, loading } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [course, setCourse] = useState<string>('Grade 1');
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admission_team')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && id) {
      loadStudent();
    }
  }, [user, id]);

  // Fetches target student profile.
  const loadStudent = async () => {
    setFetching(true);
    try {
      const data = await studentApi.get(id);
      setStudent(data);
      if (data.assignedCourse) {
        setCourse(data.assignedCourse);
      } else if (data.applyingGrade) {
        setCourse(data.applyingGrade);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to fetch student details');
    } finally {
      setFetching(false);
    }
  };

  // Submits the course assignment.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!COURSE_LIST.includes(course)) {
      setError('Invalid course grade selection');
      setSubmitting(false);
      return;
    }

    try {
      await admissionApi.assignCourse(id, course);
      router.push('/admission/applications');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to assign course');
      setSubmitting(false);
    }
  };

  if (loading || fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Loading Profile...</h2>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="dashboard-wrapper">
          <div className="glass-card" style={{ maxWidth: '100%', textAlign: 'center' }}>
            <AlertCircle size={48} style={{ color: 'var(--error)', marginBottom: '16px' }} />
            <h2>Student Record Not Found</h2>
            <Link href="/admission/applications" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Back to List
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />

      <main className="dashboard-wrapper" style={{ maxWidth: '500px', margin: '40px auto 0' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/admission/applications" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <ChevronLeft size={16} />
            <span>Back to Applications List</span>
          </Link>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>Assign Course / Grade</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Select a course grade level to complete admission for <strong>{student.name}</strong> (Exam Score: {student.examScore}/100).
          </p>

          {error && (
            <div className="alert-banner alert-error" style={{ marginBottom: '20px' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Course Grade Level</label>
              <select
                className="form-select"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              >
                {COURSE_LIST.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              disabled={submitting}
            >
              <Save size={18} />
              <span>Assign Course & Complete Admission</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
