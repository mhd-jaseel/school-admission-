'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import Navbar from '../../../../components/Navbar';
import AdmissionStepper from '../../../../components/AdmissionStepper';
import { ChevronLeft, CreditCard, CalendarDays, Edit, AlertCircle, CheckCircle2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { Student, ExamSlot } from '../../../../lib/types';
import { studentApi, examSlotApi } from '../../../../lib/api';
import styles from './details.module.css';
import Swal from 'sweetalert2';

// Student details page that shows progress steps, handles mock payment, slot booking, and inline editing.
export default function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const { user, loading } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState('Male');
  const [editPreviousSchool, setEditPreviousSchool] = useState('');
  const [editApplyingGrade, setEditApplyingGrade] = useState('Grade 1');

  const [nameError, setNameError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [schoolError, setSchoolError] = useState<string | null>(null);

  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [parentNameError, setParentNameError] = useState<string | null>(null);
  const [parentPhoneError, setParentPhoneError] = useState<string | null>(null);

  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!loading && (!user || user.role !== 'parent')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && id) {
      loadStudentData();
    }
  }, [user, id]);

  // Loads student and available slot details from backend.
  const loadStudentData = async () => {
    setFetching(true);
    setError(null);
    try {
      const studentData = await studentApi.get(id);
      setStudent(studentData);
      
      // Initialize edit fields
      setEditName(studentData.name);
      setEditDob(studentData.dob);
      setEditGender(studentData.gender);
      setEditPreviousSchool(studentData.previousSchool);
      setEditApplyingGrade(studentData.applyingGrade);
      setEditParentName(studentData.parentName || '');
      setEditParentPhone(studentData.parentPhone || '');

      if (studentData.status === 'Registration Fee Paid') {
        const slotsData = await examSlotApi.listAvailable();
        setSlots(slotsData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load details');
    } finally {
      setFetching(false);
    }
  };

  // Triggers the mock registration fee payment API.
  const handlePayFee = async () => {
    Swal.fire({
      title: 'Registration Fee Payment',
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <p style="margin-bottom: 12px; font-size: 0.95rem; color: var(--text-muted);">Please review the application fee details below:</p>
          <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; font-weight: 600; color: #1f2937;">
              <span>Admission Processing Fee:</span>
              <span>$100.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #6b7280; margin-top: 4px;">
              <span>Tax & Gateway charges:</span>
              <span>Included</span>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Pay Now ($100.00)',
      cancelButtonText: 'Cancel',
      confirmButtonColor: 'var(--primary)',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setError(null);
        setActionLoading(true);
        try {
          await studentApi.payFee(id);
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
            text: 'Mock payment processed successfully!',
            confirmButtonColor: 'var(--success)'
          });
          await loadStudentData();
        } catch (err: any) {
          setError(err.message || 'Payment processing failed');
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: err.message || 'Failed to process payment',
            confirmButtonColor: 'var(--error)'
          });
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  // Registers the chosen entrance exam slot.
  const handleBookSlot = async () => {
    if (!selectedSlotId) {
      setError('Please select an exam slot first.');
      return;
    }
    const slot = slots.find(s => s._id === selectedSlotId);
    if (!slot) return;

    Swal.fire({
      title: 'Confirm Exam Booking',
      text: `Are you sure you want to book the entrance exam slot on ${slot.date} at ${slot.time}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Book it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: 'var(--primary)',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setError(null);
        setActionLoading(true);
        try {
          await examSlotApi.book(selectedSlotId, id);
          Swal.fire({
            icon: 'success',
            title: 'Booking Confirmed!',
            text: 'Your entrance exam slot has been booked successfully.',
            confirmButtonColor: 'var(--success)'
          });
          await loadStudentData();
        } catch (err: any) {
          setError(err.message || 'Slot booking failed');
          Swal.fire({
            icon: 'error',
            title: 'Booking Failed',
            text: err.message || 'Failed to book slot',
            confirmButtonColor: 'var(--error)'
          });
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  // Performs client-side validation checks
  const validateForm = (): boolean => {
    let isValid = true;
    setNameError(null);
    setDobError(null);
    setSchoolError(null);

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!editName.trim()) {
      setNameError('Student full name is required');
      isValid = false;
    } else if (!nameRegex.test(editName)) {
      setNameError('Name must be 2-50 characters long and contain only letters and spaces');
      isValid = false;
    }

    if (!editDob) {
      setDobError('Date of birth is required');
      isValid = false;
    } else {
      const birthDate = new Date(editDob);
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

    if (!editPreviousSchool.trim()) {
      setSchoolError('Previous school name is required');
      isValid = false;
    } else if (editPreviousSchool.trim().length < 3) {
      setSchoolError('School name must be at least 3 characters long');
      isValid = false;
    }

    const nameRegex2 = /^[a-zA-Z\s]{2,50}$/;
    if (!editParentName.trim()) {
      setParentNameError('Parent name is required');
      isValid = false;
    } else if (!nameRegex2.test(editParentName)) {
      setParentNameError('Parent name must contain only letters and spaces (2-50 chars)');
      isValid = false;
    }

    const phoneRegex = /^\+?[0-9\s-]{10,20}$/;
    if (!editParentPhone.trim()) {
      setParentPhoneError('Parent phone number is required');
      isValid = false;
    } else if (!phoneRegex.test(editParentPhone)) {
      setParentPhoneError('Please enter a valid phone number (10-20 digits)');
      isValid = false;
    }

    return isValid;
  };

  // Submits the edited fields for student profile prior to payment.
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setActionLoading(true);

    if (student?.status !== 'Application Created') {
      setError('Cannot edit application details after registration fee has been paid');
      setActionLoading(false);
      return;
    }

    try {
      const updated = await studentApi.update(id, {
        name: editName.trim(),
        dob: editDob,
        gender: editGender,
        previousSchool: editPreviousSchool.trim(),
        applyingGrade: editApplyingGrade,
        parentName: editParentName.trim(),
        parentPhone: editParentPhone.trim(),
      });
      setStudent(updated);
      setIsEditing(false);
      setSuccessMsg('Application details updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update details');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Loading Application Details...</h2>
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
            <h2>Student Application Not Found</h2>
            <Link href="/parent/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />

      <main className="dashboard-wrapper">
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/parent/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          {student.status === 'Application Created' && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
              <Edit size={16} />
              <span>Edit Details</span>
            </button>
          )}
        </div>

        <AdmissionStepper currentStatus={student.status} />

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert-banner alert-success">
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        <div className={styles.detailLayout}>
          <div className={styles.detailMain}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Application Profile
            </h2>
            
            {isEditing ? (
              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
                <div className="form-group">
                  <label className="form-label">Student Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderColor: nameError ? 'var(--error)' : '' }}
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
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
                      value={editDob}
                      onChange={(e) => {
                        setEditDob(e.target.value);
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
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Previous School Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderColor: schoolError ? 'var(--error)' : '' }}
                    value={editPreviousSchool}
                    onChange={(e) => {
                      setEditPreviousSchool(e.target.value);
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

                <div className="form-group">
                  <label className="form-label">Applying Grade</label>
                  <select
                    className="form-select"
                    value={editApplyingGrade}
                    onChange={(e) => setEditApplyingGrade(e.target.value)}
                    required
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Parent Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderColor: parentNameError ? 'var(--error)' : '' }}
                    value={editParentName}
                    onChange={(e) => {
                      setEditParentName(e.target.value);
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
                    value={editParentPhone}
                    onChange={(e) => {
                      setEditParentPhone(e.target.value);
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

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={actionLoading}>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={actionLoading}>
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Student Name</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{student.name}</div>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Date of Birth</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{student.dob}</div>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Gender</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{student.gender}</div>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Applying Grade</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{student.applyingGrade}</div>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Previous School</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{student.previousSchool}</div>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Parent Name</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{student.parentName || 'N/A'}</div>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Parent Phone Number</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{student.parentPhone || 'N/A'}</div>
                  </div>
                </div>

                {/* Step Action Blocks */}
                {student.status === 'Application Created' && (
                  <div style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '12px' }}>
                      <CreditCard size={20} />
                      <span>Registration Fee Payment Required</span>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                      To process your child's application and secure an entrance exam slot, please pay the mock registration fee. Upon payment, the student details will become read-only.
                    </p>
                    <button className="btn btn-primary" onClick={handlePayFee} disabled={actionLoading}>
                      {actionLoading ? 'Processing mock payment...' : 'Pay Registration Fee (Mock)'}
                    </button>
                  </div>
                )}

                {student.status === 'Registration Fee Paid' && (
                  <div style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', marginBottom: '12px' }}>
                      <CalendarDays size={20} />
                      <span>Book Entrance Exam Slot</span>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                      Select one of the available dates and timings below. You can book only one slot.
                    </p>

                    {slots.filter(s => s.bookedCount < s.maxStudents).length === 0 ? (
                      <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No entrance exam slots are currently available. Please check back later.</p>
                    ) : (
                      <>
                        <div className={styles.slotsGrid}>
                          {slots.filter(s => s.bookedCount < s.maxStudents).map((slot) => (
                            <div
                              key={slot._id}
                              className={`${styles.slotCard} ${selectedSlotId === slot._id ? styles.selected : ''}`}
                              onClick={() => setSelectedSlotId(slot._id)}
                            >
                              <div className={styles.slotDate}>{slot.date}</div>
                              <div className={styles.slotTime}>{slot.time}</div>
                            </div>
                          ))}
                        </div>
                        
                        <button
                          className="btn btn-primary"
                          onClick={handleBookSlot}
                          disabled={actionLoading || !selectedSlotId}
                          style={{ marginTop: '16px' }}
                        >
                          {actionLoading ? 'Booking Slot...' : 'Confirm Booked Slot'}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {student.status !== 'Application Created' && student.status !== 'Registration Fee Paid' && student.examSlotId && (
                  <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Exam Slot Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <span className="student-details-label" style={{ display: 'block', fontSize: '0.8rem' }}>Exam Date</span>
                        <span style={{ fontWeight: 600 }}>{student.examSlotId.date}</span>
                      </div>
                      <div>
                        <span className="student-details-label" style={{ display: 'block', fontSize: '0.8rem' }}>Exam Time</span>
                        <span style={{ fontWeight: 600 }}>{student.examSlotId.time}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className={styles.detailSidebar}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Workflow Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Current Status</div>
                <div style={{ marginTop: '4px', fontSize: '0.95rem', fontWeight: 700, color: student.status === 'Admission Completed' ? 'var(--success)' : 'var(--primary)' }}>
                  {student.status}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>Action Checklist</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
                    <input 
                      type="checkbox" 
                      checked={student.status !== 'Application Created'} 
                      readOnly 
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'default' }} 
                    />
                    <span style={{ textDecoration: student.status !== 'Application Created' ? 'line-through' : 'none' }}>
                      Create Application Profile
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
                    <input 
                      type="checkbox" 
                      checked={!['Application Created'].includes(student.status)} 
                      readOnly 
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'default' }} 
                    />
                    <span style={{ textDecoration: !['Application Created'].includes(student.status) ? 'line-through' : 'none' }}>
                      Pay mock registration fee
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
                    <input 
                      type="checkbox" 
                      checked={!['Application Created', 'Registration Fee Paid'].includes(student.status)} 
                      readOnly 
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'default' }} 
                    />
                    <span style={{ textDecoration: !['Application Created', 'Registration Fee Paid'].includes(student.status) ? 'line-through' : 'none' }}>
                      Book Entrance Exam slot
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
                    <input 
                      type="checkbox" 
                      checked={!['Application Created', 'Registration Fee Paid', 'Slot Booked'].includes(student.status)} 
                      readOnly 
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'default' }} 
                    />
                    <span style={{ textDecoration: !['Application Created', 'Registration Fee Paid', 'Slot Booked'].includes(student.status) ? 'line-through' : 'none' }}>
                      Attend Entrance Exam
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
                    <input 
                      type="checkbox" 
                      checked={student.status === 'Admission Completed'} 
                      readOnly 
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'default' }} 
                    />
                    <span style={{ textDecoration: student.status === 'Admission Completed' ? 'line-through' : 'none' }}>
                      Course Assignment by Team
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
