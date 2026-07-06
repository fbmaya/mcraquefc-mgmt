import { apiFetch } from './client';
import type {
  School,
  SchoolDetail,
  SchoolUser,
  License,
  Overview,
  PlanType,
  LicenseStatus,
} from './types';

// ── Input payloads (mirror the FastAPI request schemas) ──────

export interface SchoolInput {
  name: string;
  primary_color?: string;
  active?: boolean;
}

export interface LicenseInput {
  plan?: PlanType;
  status?: LicenseStatus;
  max_students?: number;
  max_coaches?: number;
  expires_at?: string | null;
  notes?: string | null;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'coach';
}

// ── Endpoints (platform admin only) ──────────────────────────

export const api = {
  overview: () => apiFetch<Overview>('/platform/overview'),
  schools: {
    list: () => apiFetch<School[]>('/platform/schools'),
    detail: (id: string) => apiFetch<SchoolDetail>(`/platform/schools/${id}`),
    create: (body: SchoolInput) =>
      apiFetch<School>('/platform/schools', { method: 'POST', body }),
    update: (id: string, body: Partial<SchoolInput>) =>
      apiFetch<School>(`/platform/schools/${id}`, { method: 'PATCH', body }),
  },
  license: {
    update: (schoolId: string, body: LicenseInput) =>
      apiFetch<License>(`/platform/schools/${schoolId}/license`, { method: 'PATCH', body }),
  },
  users: {
    list: (schoolId: string) =>
      apiFetch<SchoolUser[]>(`/platform/schools/${schoolId}/users`),
    create: (schoolId: string, body: UserInput) =>
      apiFetch<SchoolUser>(`/platform/schools/${schoolId}/users`, { method: 'POST', body }),
    remove: (schoolId: string, userId: string) =>
      apiFetch<void>(`/platform/schools/${schoolId}/users/${userId}`, { method: 'DELETE' }),
  },
};
