import { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { LicenseModal } from './LicenseModal';
import { AddUserModal } from './AddUserModal';
import { useSchoolDetail, useSchoolUsers, useDeleteUser } from '../hooks/queries';
import type { UserRole } from '../api/types';

const ROLE_BADGE: Record<string, string> = {
  manager: 'badge-blue',
  coach: 'badge-green',
  parent: 'badge-gray',
  platform_admin: 'badge-yellow',
};

function roleBadge(role: UserRole) {
  return ROLE_BADGE[role] ?? 'badge-gray';
}

export function SchoolDetailModal({ schoolId, onClose }: { schoolId: string; onClose: () => void }) {
  const { data, isLoading, error } = useSchoolDetail(schoolId);
  const { data: users } = useSchoolUsers(schoolId);
  const deleteUser = useDeleteUser();
  const toast = useToast();
  const [showLicense, setShowLicense] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  async function onDeleteUser(userId: string, name: string) {
    if (!confirm(`Remover "${name}"?`)) return;
    try {
      await deleteUser.mutateAsync({ schoolId, userId });
      toast('Usuário removido');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha ao remover', 'err');
    }
  }

  const lic = data?.license ?? null;

  return (
    <>
      <Modal title="Detalhes da escolinha" onClose={onClose} wide>
        {isLoading && <p className="loading">Carregando…</p>}
        {error && <p className="empty">Erro: {error instanceof Error ? error.message : 'falha'}</p>}
        {data && (
          <>
            <div className="detail-grid">
              <div>
                <div className="kpi-label">Alunos</div>
                <div className="big">{data.student_count}</div>
              </div>
              <div>
                <div className="kpi-label">Professores</div>
                <div className="big">{data.coach_count}</div>
              </div>
            </div>

            <p className="subhead">Licença</p>
            <div className="license-box">
              <div><span className="kpi-label">Plano</span><br />{lic?.plan ?? '—'}</div>
              <div><span className="kpi-label">Status</span><br />{lic?.status ?? '—'}</div>
              <div><span className="kpi-label">Máx. alunos</span><br />{lic?.max_students ?? '—'}</div>
              <div><span className="kpi-label">Máx. professores</span><br />{lic?.max_coaches ?? '—'}</div>
              <div><span className="kpi-label">Expira em</span><br />{lic?.expires_at ?? 'Sem data'}</div>
            </div>

            <div className="detail-actions">
              <button className="sm" onClick={() => setShowLicense(true)}>Editar licença</button>
              <button className="sm" onClick={() => setShowAddUser(true)}>+ Adicionar usuário</button>
            </div>

            <p className="subhead">Usuários</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Nome</th><th>Email</th><th>Perfil</th><th></th></tr></thead>
                <tbody>
                  {users && users.length ? (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${roleBadge(u.role)}`}>{u.role}</span></td>
                        <td>
                          <button className="ghost danger sm" onClick={() => onDeleteUser(u.id, u.name)}>
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="empty">Nenhum usuário</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Modal>

      {showLicense && (
        <LicenseModal schoolId={schoolId} license={lic} onClose={() => setShowLicense(false)} />
      )}
      {showAddUser && (
        <AddUserModal schoolId={schoolId} onClose={() => setShowAddUser(false)} />
      )}
    </>
  );
}
