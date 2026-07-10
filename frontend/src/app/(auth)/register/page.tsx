'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import styles from './register.module.css';

// Renders the registration form for new Parent user accounts with validation.
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const { register, user, loading } = useAuth();
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
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!name) {
      setNameError('Full name is required');
      isValid = false;
    } else if (!nameRegex.test(name)) {
      setNameError('Name must be 2-50 characters long and contain only letters and spaces');
      isValid = false;
    }

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

  // Handles form submission for parent signups.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await register(email, password, name);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
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
          <h2>Create Account</h2>
          <p>Register as a Parent</p>
        </div>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              style={{ borderColor: nameError ? 'var(--error)' : '' }}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              required
            />
            {nameError && (
              <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                {nameError}
              </span>
            )}
          </div>

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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        <div className={styles.authSwitch}>
          <span>Already have an account? </span>
          <Link href="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
