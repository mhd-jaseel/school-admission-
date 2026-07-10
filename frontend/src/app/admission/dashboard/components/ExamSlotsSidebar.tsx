import React from 'react';
import { AlertCircle, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { ExamSlot } from '../../../../lib/types';
import styles from './ExamSlotsSidebar.module.css';

interface ExamSlotsSidebarProps {
  slots: ExamSlot[];
  slotDate: string;
  setSlotDate: (date: string) => void;
  slotTime: string;
  setSlotTime: (time: string) => void;
  slotMaxStudents: string;
  setSlotMaxStudents: (val: string) => void;
  addingSlot: boolean;
  slotError: string | null;
  slotSuccess: string | null;
  handleAddSlot: (e: React.FormEvent) => void;
  dateErr: string | null;
  timeErr: string | null;
  maxStudentsErr: string | null;
  isFormValid: boolean;
}

// Side panel for the admission team dashboard that lists exam slots and contains the slot creation form.
export default function ExamSlotsSidebar({
  slots,
  slotDate,
  setSlotDate,
  slotTime,
  setSlotTime,
  slotMaxStudents,
  setSlotMaxStudents,
  addingSlot,
  slotError,
  slotSuccess,
  handleAddSlot,
  dateErr,
  timeErr,
  maxStudentsErr,
  isFormValid,
}: ExamSlotsSidebarProps) {
  return (
    <div className={styles.detailSidebar} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Create Exam Slot</h2>
        
        {slotError && (
          <div className="alert-banner alert-error" style={{ padding: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
            <AlertCircle size={16} />
            <span>{slotError}</span>
          </div>
        )}

        {slotSuccess && (
          <div className="alert-banner alert-success" style={{ padding: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
            <CheckCircle2 size={16} />
            <span>{slotSuccess}</span>
          </div>
        )}

        <form onSubmit={handleAddSlot} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} noValidate>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              style={{ borderColor: dateErr ? 'var(--error)' : '' }}
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              required
            />
            {dateErr && (
              <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                {dateErr}
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Time Slot</label>
            <input
              type="text"
              className="form-input"
              style={{ borderColor: timeErr ? 'var(--error)' : '' }}
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              placeholder="e.g. 10:00 AM or 14:00"
              required
            />
            {timeErr && (
              <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                {timeErr}
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Maximum Students (Capacity)</label>
            <input
              type="number"
              className="form-input"
              style={{ borderColor: maxStudentsErr ? 'var(--error)' : '' }}
              value={slotMaxStudents}
              onChange={(e) => setSlotMaxStudents(e.target.value)}
              placeholder="e.g. 50"
              min={1}
              max={500}
              required
            />
            {maxStudentsErr && (
              <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                {maxStudentsErr}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', height: '42px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
            disabled={!isFormValid || addingSlot}
          >
            {addingSlot ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating Slot...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add Exam Slot</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Predefined Slots</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
          {Array.isArray(slots) && slots.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', fontSize: '0.85rem' }}>No exam slots exist yet.</p>
          ) : (
            slots.map((s) => {
              const isFull = s.bookedCount >= s.maxStudents;
              return (
                <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.date} - {s.time}</div>
                    <div style={{ fontSize: '0.75rem', color: isFull ? 'var(--error)' : 'var(--text-dim)', fontWeight: isFull ? '600' : 'normal' }}>
                      Status: {isFull ? 'Slot Full' : `Booked: ${s.bookedCount || 0} / ${s.maxStudents || 10} Students`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
