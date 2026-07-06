import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/endpoints';
import type { SchoolInput, LicenseInput, UserInput } from '../api/endpoints';

// ── Queries ──────────────────────────────────────────────────

export function useOverview() {
  return useQuery({ queryKey: ['overview'], queryFn: api.overview });
}

export function useSchools() {
  return useQuery({ queryKey: ['schools'], queryFn: api.schools.list });
}

export function useSchoolDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['school', id],
    queryFn: () => api.schools.detail(id as string),
    enabled: Boolean(id),
  });
}

export function useSchoolUsers(id: string | undefined) {
  return useQuery({
    queryKey: ['school-users', id],
    queryFn: () => api.users.list(id as string),
    enabled: Boolean(id),
  });
}

// ── Mutations ────────────────────────────────────────────────
// School counts, licenses and the overview all overlap, so invalidate broadly.

function useInvalidateAll() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}

export function useCreateSchool() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (body: SchoolInput) => api.schools.create(body),
    onSuccess: invalidate,
  });
}

export function useUpdateSchool() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (vars: { id: string; body: Partial<SchoolInput> }) =>
      api.schools.update(vars.id, vars.body),
    onSuccess: invalidate,
  });
}

export function useUpdateLicense() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (vars: { schoolId: string; body: LicenseInput }) =>
      api.license.update(vars.schoolId, vars.body),
    onSuccess: invalidate,
  });
}

export function useCreateUser() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (vars: { schoolId: string; body: UserInput }) =>
      api.users.create(vars.schoolId, vars.body),
    onSuccess: invalidate,
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (vars: { schoolId: string; userId: string }) =>
      api.users.remove(vars.schoolId, vars.userId),
    onSuccess: invalidate,
  });
}

// Suspend/reactivate keeps the school flag and license status in sync,
// mirroring the backend's own coupling.
export function useToggleSchool() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (vars: { id: string; active: boolean }) => {
      await api.schools.update(vars.id, { active: vars.active });
      await api.license.update(vars.id, {
        status: vars.active ? 'active' : 'suspended',
      });
    },
    onSuccess: invalidate,
  });
}
