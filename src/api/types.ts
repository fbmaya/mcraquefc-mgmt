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
  family_included: boolean;
  family_price_per_student: number | null;
  family_seats: number | null;
  expires_at: string | null;
  notes: string | null;
}

export interface SchoolDetail {
  school: School;
  license: License | null;
  manager_count: number;
  coach_count: number;
  student_count: number;
  active_student_count: number;
  family_over_quota: boolean;
}

export interface SchoolUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school_id: string | null;
}

export type FamilySubStatus = 'active' | 'overdue' | 'cancelled' | 'pending';
export type FamilyPriceTier = 'cheio' | 'pontualidade' | 'promo';

export interface FamilySubscription {
  id: string;
  parent_id: string;
  parent_email: string | null;
  parent_name: string | null;
  school_id: string;
  status: FamilySubStatus;
  price_tier: FamilyPriceTier;
  current_period: string | null;
  expires_at: string | null;
}

export interface Overview {
  total_schools: number;
  active_schools: number;
  total_students: number;
  total_users: number;
  licenses_by_plan: Record<string, number>;
}
