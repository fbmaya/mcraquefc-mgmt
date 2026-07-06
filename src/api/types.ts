// Types mirroring the FastAPI /platform/* and /auth schemas.

export type UserRole = 'platform_admin' | 'manager' | 'coach' | 'parent';
export type PlanType = 'trial' | 'starter' | 'pro' | 'elite';
export type LicenseStatus = 'active' | 'suspended' | 'cancelled';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  name: string;
  role: UserRole;
  school_id: string | null;
}

export interface School {
  id: string;
  name: string;
  primary_color: string;
  active: boolean;
}

export interface License {
  id: string;
  school_id: string;
  plan: PlanType;
  status: LicenseStatus;
  max_students: number;
  max_coaches: number;
  expires_at: string | null;
  notes: string | null;
}

export interface SchoolDetail {
  school: School;
  license: License | null;
  manager_count: number;
  coach_count: number;
  student_count: number;
}

export interface SchoolUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school_id: string | null;
}

export interface Overview {
  total_schools: number;
  active_schools: number;
  total_students: number;
  total_users: number;
  licenses_by_plan: Record<string, number>;
}
