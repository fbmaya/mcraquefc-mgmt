import { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { LicenseModal } from './LicenseModal';
import { AddUserModal } from './AddUserModal';
import { FamilySubscriptionModal } from './FamilySubscriptionModal';
import {
  useSchoolDetail, useSchoolUsers, useDeleteUser,
  useFamilySubscriptions, useCancelSubscription,
} from '../hooks/queries';
import type { UserRole, FamilySubStatus } from '../api/types';

const ROLE_BADGE: Record<string, string> = {
  manager: 'badge-blue',
  coach: 'badge-green',
  parent: 'badge-gray',
  platform_admin: 'badge-yellow',
};

const SUB_BADGE: Record<FamilySubStatus, string> = {
  active: 'badge-green',
  overdue: 'badge-yellow',
  pending: 'badge-gray',
  cancelled: 'badge-red',
};

function roleBadge(role: UserRole) {
  return ROLE_BADGE[role] ?? 'badge-gray';
}

export function SchoolDetailModal({ schoolId, onClose }: { schoolId: string; onClose: () => void }) {
  const { data, isLoading, error } = useSchoolDetail(schoolId);
  const { data: users } = useSchoolUsers(schoolId);
  const { data: subs } = useFamilySubscriptions(schoolId);
  const deleteUser = useDeleteUser();
  const cancelSub = useCancelSubscription();
  const toast = useToast();
  const [showLicense, setShowLicense] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);

  async function onDeleteUser(userId: string, name: string) {
    if (!confirm(`Remover "${name}"?`)) return;
    try {
      await deleteUser.mutateAsync({ schoolId, userId });
      toast('Usuário removido');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha ao remover', 'err');
    }
  }

  async function onCancelSub(subscriptionId: string) {
    if (!confirm('Cancelar esta assinatura Family?')) return;
    try {
      await cancelSub.mutateAsync({ subscriptionId });
      toast('Assinatura cancelada');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha ao cancelar', 'err');
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

            {data.family_over_quota && (
              <p className="alert alert-warning">
                ⚠️ Alunos ativos ({data.active_student_count}) acima da cota Family contratada
                ({lic?.family_seats}). O acesso NÃO é bloqueado — considere renegociar o pacote.
              </p>
            )}

            <p className="subhead">Licença</p>
            <div className="license-box">
              <div><span className="kpi-label">Plano</span><br />{lic?.plan ?? '—'}</div>
              <div><span className="kpi-label">Status</span><br />{lic?.status ?? '—'}</div>
              <div><span className="kpi-label">Máx. alunos</span><br />{lic?.max_students ?? '—'}</div>
              <div><span className="kpi-label">Máx. professores</span><br />{lic?.max_coaches ?? '—'}</div>
              <div><span className="kpi-label">Expira em</span><br />{lic?.expires_at ?? 'Sem data'}</div>
            </div>

            <div className="license-box">
              <div>
                <span className="kpi-label">Family incluso</span><br />
                {lic?.family_included
                  ? <span className="badge badge-green">Sim</span>
                  : <span className="badge badge-gray">Não</span>}
              </div>
              <div><span className="kpi-label">Preço/aluno</span><br />
                {lic?.family_price_per_student != null ? `R$ ${lic.family_price_per_student}` : '—'}</div>
              <div><span className="kpi-label">Cota Family</span><br />
                {lic?.family_seats ?? 'ilimitado'}</div>
              <div><span className="kpi-label">Alunos ativos</span><br />{data.active_student_count}</div>
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

            <div className="section-head">
              <p className="subhead">Assinaturas Family (individuais)</p>
              <button className="sm" onClick={() => setShowAddSub(true)}>+ Nova assinatura</button>
            </div>
            {lic?.family_included && (
              <p className="alert alert-warning">
                Esta escola tem Family incluso no plano — os responsáveis já têm acesso automático.
                Assinaturas individuais só são necessárias quando o plano NÃO inclui Family.
              </p>
            )}
            <div className="table-wrap">
              <table>
                <thead><tr><th>Responsável</th><th>Status</th><th>Faixa</th><th>Vence</th><th></th></tr></thead>
                <tbody>
                  {subs && subs.length ? (
                    subs.map((s) => (
                      <tr key={s.id}>
                        <td>{s.parent_name ?? s.parent_email ?? s.parent_id}</td>
                        <td><span className={`badge ${SUB_BADGE[s.status]}`}>{s.status}</span></td>
                        <td>{s.price_tier}</td>
                        <td>{s.expires_at ?? '—'}</td>
                        <td>
                          {s.status !== 'cancelled' && (
                            <button className="ghost danger sm" onClick={() => onCancelSub(s.id)}>
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="empty">Nenhuma assinatura individual</td></tr>
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
      {showAddSub && (
        <FamilySubscriptionModal schoolId={schoolId} onClose={() => setShowAddSub(false)} />
      )}
    </>
  );
}
