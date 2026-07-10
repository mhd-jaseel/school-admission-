'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, GraduationCap } from 'lucide-react';
import styles from './Navbar.module.css';

// Renders the global navigation bar containing links, user credentials, and the logout trigger.
export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <Link href={user.role === 'admission_team' ? '/admission/dashboard' : '/parent/dashboard'} className={styles.logo}>
        <GraduationCap size={28} />
        <span>ABC Academy</span>
      </Link>

      <div className={styles.navLinks}>
        {user.role === 'parent' ? (
          <>
            <Link href="/parent/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link href="/parent/students/create" className={styles.navLink}>
              New Application
            </Link>
          </>
        ) : (
          <>
            <Link href="/admission/dashboard" className={styles.navLink}>
              Control Panel
            </Link>
            <Link href="/admission/applications" className={styles.navLink}>
              Applications List
            </Link>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={styles.userBadge}>
            <UserIcon size={14} />
            <span>{user.name}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({user.role === 'admission_team' ? 'Staff' : 'Parent'})</span>
          </div>

          <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 12px', display: 'flex', gap: '6px' }}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
