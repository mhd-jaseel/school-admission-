'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, HelpCircle, ArrowRight, Eye, X, Award, GraduationCap, Calendar, User, School, Clock } from 'lucide-react';
import { Student } from '../../../../lib/types';
import styles from './ApplicationsTable.module.css';

interface ApplicationsTableProps {
  students: Student[];
  limit?: number;
  showViewAllLink?: boolean;
}

// Renders the Applications list view inside the dashboard panel with search, filtering, and a detail modal.
export default function ApplicationsTable({ students, limit, showViewAllLink }: ApplicationsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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

  const filteredStudents = (Array.isArray(students) ? students : []).filter((student) => {
    if (!student) return false;
    const nameMatch = student.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const schoolMatch = student.previousSchool?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesSearch = nameMatch || schoolMatch;
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayedStudents = limit ? filteredStudents.slice(0, limit) : filteredStudents;

  return (
    <div className="detail-main" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Student Applications</h2>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', height: '42px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
            />
          </div>

          {/* Filter */}
          <select
            className="form-select"
            style={{ width: '160px', height: '42px', padding: '0 12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="Application Created">Application Created</option>
            <option value="Registration Fee Paid">Registration Fee Paid</option>
            <option value="Slot Booked">Slot Booked</option>
            <option value="Exam Completed">Exam Completed</option>
            <option value="Admission Completed">Admission Completed</option>
          </select>
        </div>
      </div>

      {displayedStudents.length === 0 ? (
        <div className="empty-state" style={{ border: 'none' }}>
          <HelpCircle size={40} style={{ color: 'var(--text-dim)', marginBottom: '12px' }} />
          <h3>No Applications Found</h3>
          <p>Try resetting the filters or modifying your query.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student) => {
                  return (
                    <tr key={student._id} onClick={() => setSelectedStudent(student)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{student.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>School: {student.previousSchool}</div>
                      </td>
                      <td>{student.assignedCourse || student.applyingGrade}</td>
                      <td>
                        <span className={`student-status-badge ${getStatusClass(student.status)}`} style={{ fontSize: '0.75rem' }}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: student.examScore !== undefined ? '600' : 'normal' }}>
                          {student.examScore !== undefined ? `${student.examScore}/100` : '-'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {['Slot Booked', 'Exam Completed', 'Admission Completed'].includes(student.status) && (
                            <Link href={`/admission/applications/${student._id}/update-score`} className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={(e) => e.stopPropagation()}>
                              <span>{student.examScore !== undefined ? 'Edit Score' : 'Score'}</span>
                              <ArrowRight size={12} />
                            </Link>
                          )}
                          {['Exam Completed', 'Admission Completed'].includes(student.status) && (
                            <Link href={`/admission/applications/${student._id}/assign-course`} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={(e) => e.stopPropagation()}>
                              <span>{student.assignedCourse ? 'Edit Course' : 'Course'}</span>
                              <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showViewAllLink && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <Link href="/admission/applications" className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <span>View All Applications</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </>
      )}

      {/* Full Student Profile Detail Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '16px'
        }} onClick={() => setSelectedStudent(null)}>
          <div className="glass-card" style={{
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            background: 'var(--bg-primary)',
            boxShadow: 'var(--shadow-md)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>{selectedStudent.name}</h3>
                <span className={`student-status-badge ${getStatusClass(selectedStudent.status)}`} style={{ display: 'inline-block', marginTop: '4px' }}>
                  {selectedStudent.status}
                </span>
              </div>
            </div>

            {/* Details List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.925rem', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Applying Grade</span>
                  <span style={{ fontWeight: 600 }}>{selectedStudent.applyingGrade}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Date of Birth</span>
                  <span style={{ fontWeight: 600 }}>{selectedStudent.dob}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Gender</span>
                  <span style={{ fontWeight: 600 }}>{selectedStudent.gender}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', fontWeight: 600 }}>Previous School</span>
                  <span style={{ fontWeight: 600 }}>{selectedStudent.previousSchool}</span>
                </div>
              </div>

              {/* Parent contact details */}
              <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  <User size={14} />
                  <span>PARENT CONTACT DETAILS</span>
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem' }}>
                  <div>Name: <strong>{selectedStudent.parentName || (selectedStudent.parentId && typeof selectedStudent.parentId === 'object' && 'name' in selectedStudent.parentId ? (selectedStudent.parentId as any).name : 'N/A')}</strong></div>
                  <div>Email: <strong>{selectedStudent.parentId && typeof selectedStudent.parentId === 'object' && 'email' in selectedStudent.parentId ? (selectedStudent.parentId as any).email : 'N/A'}</strong></div>
                  <div>Phone: <strong>{selectedStudent.parentPhone || (selectedStudent.parentId && typeof selectedStudent.parentId === 'object' && 'phone' in selectedStudent.parentId ? (selectedStudent.parentId as any).phone || 'N/A' : 'N/A')}</strong></div>
                </div>
              </div>

              {/* Exam Slot details */}
              {selectedStudent.examSlotId && (
                <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    <Calendar size={14} />
                    <span>ENTRANCE EXAM SCHEDULE</span>
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>Date: <strong>{(selectedStudent.examSlotId as any).date}</strong></span>
                    <span>Time: <strong>{(selectedStudent.examSlotId as any).time}</strong></span>
                  </div>
                </div>
              )}

              {/* Workflow Actions Outputs */}
              {(selectedStudent.examScore !== undefined || selectedStudent.assignedCourse) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  {selectedStudent.examScore !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Award size={16} /> Exam Score:
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedStudent.examScore} / 100</span>
                    </div>
                  )}
                  {selectedStudent.assignedCourse && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <GraduationCap size={16} /> Assigned Course:
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--success)' }}>{selectedStudent.assignedCourse}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Edit Redirection Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {selectedStudent.status === 'Slot Booked' && (
                <Link
                  href={`/admission/applications/${selectedStudent._id}/update-score`}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', textAlign: 'center' }}
                >
                  Enter Exam Score
                </Link>
              )}
              {selectedStudent.status === 'Exam Completed' && (
                <Link
                  href={`/admission/applications/${selectedStudent._id}/assign-course`}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', textAlign: 'center' }}
                >
                  Assign Course/Grade
                </Link>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setSelectedStudent(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
