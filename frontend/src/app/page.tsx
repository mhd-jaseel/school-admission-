'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// Root page component that inspects user status and routes to login or the correct dashboard.
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Inspects user session role on initial load and redirects accordingly.
  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'admission_team') {
          router.push('/admission/dashboard');
        } else {
          router.push('/parent/dashboard');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      color: 'var(--text-muted)',
      fontFamily: 'inherit'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Loading Academic Portal...</h2>
        <p>Verifying credentials</p>
      </div>
    </div>
  );
}
