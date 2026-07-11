import { getToken, clearToken } from '../auth';
import { Student, ExamSlot, User } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Core api wrapper for carrying out fetch requests with Bearer Token auth.
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    cache: 'no-store',
    ...options,
    headers,
  });

  if (res.status === 401 && endpoint !== '/auth/login') {
    clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized or expired session');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message;
    throw new Error(errorMsg || 'An error occurred during request');
  }
  return data as T;
}

// Authentication API endpoints.
export const authApi = {
  login: (body: any) =>
    request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  register: (body: any) =>
    request<{ message: string; userId: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

// Student API endpoints (Parent perspective).
export const studentApi = {
  create: (body: any) =>
    request<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (id: string, body: any) =>
    request<Student>(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  get: (id: string) => request<Student>(`/students/${id}`),

  list: () => request<Student[]>('/students'),

  payFee: (studentId: string) =>
    request<Student>(`/students/${studentId}/registration-fee`, {
      method: 'POST',
    }),
};

// Exam Slot API endpoints.
export const examSlotApi = {
  listAvailable: () => request<ExamSlot[]>('/exam-slots'),

  book: (slotId: string, studentId: string) =>
    request<Student>(`/exam-slots/${slotId}/book`, {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    }),
};

// Admissions API endpoints (Admission Team perspective).
export const admissionApi = {
  list: () => request<Student[]>('/admissions'),

  updateScore: (id: string, score: number) =>
    request<Student>(`/admissions/${id}/exam-score`, {
      method: 'PATCH',
      body: JSON.stringify({ score }),
    }),

  assignCourse: (id: string, course: string) =>
    request<Student>(`/admissions/${id}/course`, {
      method: 'PATCH',
      body: JSON.stringify({ course }),
    }),
};
