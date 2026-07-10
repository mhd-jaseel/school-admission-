import React from 'react';
import { Users, FileText, Calendar, CheckCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    paid: number;
    booked: number;
    completed: number;
  };
}

// Renders the summary cards (total, paid, booked, completed) for the admission team control panel.
export default function StatsGrid({ stats }: StatsProps) {
  const cards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: <Users size={28} />,
      bg: 'rgba(99, 102, 241, 0.15)',
      color: 'var(--primary)',
    },
    {
      title: 'Fees Paid',
      value: stats.paid,
      icon: <FileText size={28} />,
      bg: 'rgba(245, 158, 11, 0.15)',
      color: 'var(--warning)',
    },
    {
      title: 'Slots Booked',
      value: stats.booked,
      icon: <Calendar size={28} />,
      bg: 'rgba(59, 130, 246, 0.15)',
      color: '#60a5fa',
    },
    {
      title: 'Completed Admissions',
      value: stats.completed,
      icon: <CheckCircle size={28} />,
      bg: 'rgba(16, 185, 129, 0.15)',
      color: 'var(--success)',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
      {cards.map((card, idx) => (
        <div key={idx} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '100%' }}>
          <div style={{ background: card.bg, color: card.color, padding: '12px', borderRadius: '12px' }}>
            {card.icon}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{card.title}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
