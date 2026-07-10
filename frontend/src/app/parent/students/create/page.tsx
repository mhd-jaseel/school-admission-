'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import Navbar from '../../../../components/Navbar';
import { ChevronLeft, Save, AlertCircle, User as UserIcon, BookOpen, Phone } from 'lucide-react';
import Link from 'next/link';
import { studentApi } from '../../../../lib/api';
import styles from './create.module.css';

// Create student application page for Parents with a simple, professional layout.
export default function CreateStudent() {
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [applyingGrade, setApplyingGrade] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [schoolError, setSchoolError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentNameError, setParentNameError] = useState<string | null>(null);
  const [parentPhoneError, setParentPhoneError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setParentName(user.name || '');
      setParentPhone(user.phone || '');
    }
  }, [user]);

  // Route protection
  useEffect(() => {
    if (!loading && (!user || user.role !== 'parent')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Client-side validation checks
  const validateForm = (): boolean => {
    let isValid = true;
    setNameError(null);
    setDobError(null);
    setSchoolError(null);
    setGenderError(null);
    setGradeError(null);
    setParentNameError(null);
    setParentPhoneError(null);

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!name.trim()) {
      setNameError('Student full name is required');
      isValid = false;
    } else if (!nameRegex.test(name)) {
      setNameError('Name must contain only letters and spaces (2-50 chars)');
      isValid = false;
    }

    if (!dob) {
      setDobError('Date of birth is required');
      isValid = false;
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (birthDate > today) {
        setDobError('Date of birth cannot be in the future');
        isValid = false;
      } else if (age < 3 || age > 18) {
        setDobError('Student age must be between 3 and 18 years old');
        isValid = false;
      }
    }

    if (!gender) {
      setGenderError('Gender selection is required');
      isValid = false;
    }

    if (!applyingGrade) {
      setGradeError('Applying grade selection is required');
      isValid = false;
    }

    if (!previousSchool.trim()) {
      setSchoolError('Previous school name is required');
      isValid = false;
    } else if (previousSchool.trim().length < 3) {
      setSchoolError('School name must be at least 3 characters long');
      isValid = false;
    }

    const nameRegex2 = /^[a-zA-Z\s]{2,50}$/;
    if (!parentName.trim()) {
      setParentNameError('Parent name is required');
      isValid = false;
    } else if (!nameRegex2.test(parentName)) {
      setParentNameError('Parent name must contain only letters and spaces (2-50 chars)');
      isValid = false;
    }

    const phoneRegex = /^\+?[0-9\s-]{10,20}$/;
    if (!parentPhone.trim()) {
      setParentPhoneError('Parent phone number is required');
      isValid = false;
    } else if (!phoneRegex.test(parentPhone)) {
      setParentPhoneError('Please enter a valid phone number (10-20 digits)');
      isValid = false;
    }

    return isValid;
  };

  // Submits the new student details.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await studentApi.create({
        name: name.trim(),
        dob,
        gender,
        previousSchool: previousSchool.trim(),
        applyingGrade,
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
      });
      router.push('/parent/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Loading Form...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />

      <main className="dashboard-wrapper">
        <div style={{ marginBottom: '24px' }}>
          <Link href="/parent/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className={styles.container}>
          <div className={styles.formCard}>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '6px' }}>Student Admission Form</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter the student details to initialize the application workflow.</p>
            </div>

            {error && (
              <div className="alert-banner alert-error" style={{ marginBottom: '24px' }}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              
              {/* Section 1: Student Personal Details */}
              <h3 className={styles.formSectionTitle}>
                <UserIcon size={18} />
                <span>Student Details</span>
              </h3>

              <div className="form-group">
                <label className="form-label">Student Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ borderColor: nameError ? 'var(--error)' : '' }}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  placeholder="Enter student's full name"
                  required
                />
                {nameError && (
                  <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} />
                    {nameError}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    style={{ borderColor: dobError ? 'var(--error)' : '' }}
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      if (dobError) setDobError(null);
                    }}
                    required
                  />
                  {dobError && (
                    <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      {dobError}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    style={{ borderColor: genderError ? 'var(--error)' : '' }}
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      if (genderError) setGenderError(null);
                    }}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {genderError && (
                    <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      {genderError}
                    </span>
                  )}
                </div>
              </div>

              {/* Section 2: Academic details */}
              <h3 className={styles.formSectionTitle}>
                <BookOpen size={18} />
                <span>Academic Information</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Applying Grade</label>
                  <select
                    className="form-select"
                    style={{ borderColor: gradeError ? 'var(--error)' : '' }}
                    value={applyingGrade}
                    onChange={(e) => {
                      setApplyingGrade(e.target.value);
                      if (gradeError) setGradeError(null);
                    }}
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                  </select>
                  {gradeError && (
                    <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      {gradeError}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Previous School Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderColor: schoolError ? 'var(--error)' : '' }}
                    value={previousSchool}
                    onChange={(e) => {
                      setPreviousSchool(e.target.value);
                      if (schoolError) setSchoolError(null);
                    }}
                    placeholder="Enter previous school name"
                    required
                  />
                  {schoolError && (
                    <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      {schoolError}
                    </span>
                  )}
                </div>
              </div>

              {/* Section 3: Parent details */}
              <h3 className={styles.formSectionTitle}>
                <Phone size={18} />
                <span>Parent Contact Info</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Parent Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderColor: parentNameError ? 'var(--error)' : '' }}
                    value={parentName}
                    onChange={(e) => {
                      setParentName(e.target.value);
                      if (parentNameError) setParentNameError(null);
                    }}
                    placeholder="Enter parent's full name"
                    required
                  />
                  {parentNameError && (
                    <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      {parentNameError}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Parent Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    style={{ borderColor: parentPhoneError ? 'var(--error)' : '' }}
                    value={parentPhone}
                    onChange={(e) => {
                      setParentPhone(e.target.value);
                      if (parentPhoneError) setParentPhoneError(null);
                    }}
                    placeholder="Enter parent's phone number"
                    required
                  />
                  {parentPhoneError && (
                    <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} />
                      {parentPhoneError}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                <Save size={18} />
                <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
