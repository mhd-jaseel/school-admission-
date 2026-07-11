'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import styles from './login.module.css';

// Renders the Login page for Parents and Admission Team with validations.
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, user, loading } = useAuth();
  const router = useRouter();

  // Redirects already-authenticated users to their respective dashboards.
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admission_team') {
        router.push('/admission/dashboard');
      } else {
        router.push('/parent/dashboard');
      }
    }
  }, [user, loading, router]);

  // Performs client-side validation checks
  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    return isValid;
  };

  // Submits email and password credentials.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setPassword('');
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className="glass-card">
        <div className={styles.authHeader}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px' }}>
            <GraduationCap size={48} />
          </div>
          <h2>Sign In</h2>
          <p>Access the Admission Portal</p>
        </div>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              style={{ borderColor: emailError ? 'var(--error)' : '' }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              required
            />
            {emailError && (
              <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                {emailError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              style={{ borderColor: passwordError ? 'var(--error)' : '' }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              required
            />
            {passwordError && (
              <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                {passwordError}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', height: '48px' }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className={styles.authSwitch}>
          <span>Don't have an account? </span>
          <Link href="/register">Register Parent</Link>
        </div>

        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed var(--border-color)',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <strong>Staff Login:</strong> admin@school.com / admin123
        </div>
      </div>
    </div>
  );
}
