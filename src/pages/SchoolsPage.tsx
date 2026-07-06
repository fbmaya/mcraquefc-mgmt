import { useState } from 'react';
import { useSchools, useToggleSchool, useSchoolDetail } from '../hooks/queries';
import { NewSchoolModal } from '../components/NewSchoolModal';
import { SchoolDetailModal } from '../components/SchoolDetailModal';
import { useToast } from '../components/Toast';
import type { School } from '../api/types';

function SchoolRow({ school, onManage }: { school: School; onManage: (id: string) => void }) {
  const { data } = useSchoolDetail(school.id);
  const toggle = useToggleSchool();
  const toast = useToast();

  async function onToggle() {
    try {
      await toggle.mutateAsync({ id: school.id, active: !school.active });
      toast(school.active ? 'Escolinha suspensa' : 'Escolinha reativada');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha', 'err');
    }
  }

  return (
    <tr>
      <td><strong>{school.name}</strong></td>
      <td>
        {school.active
          ? <span className="badge badge-green">Ativa</span>
          : <span className="badge badge-red">Suspensa</span>}
      </td>
      <td>
        {data?.license
          ? <span className="badge badge-blue">{data.license.plan}</span>
          : <span className="badge badge-gray">sem licença</span>}
      </td>
      <td>{data?.student_count ?? '—'}</td>
      <td>{data?.manager_count ?? '—'}</td>
      <td>{data?.coach_count ?? '—'}</td>
      <td>
        <div className="row-actions">
          <button className="sm" onClick={() => onManage(school.id)}>Gerenciar</button>
          <button className={'sm ' + (school.active ? 'warning' : 'success')}
            onClick={onToggle} disabled={toggle.isPending}>
            {school.active ? 'Suspender' : 'Reativar'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export function SchoolsPage() {
  const { data: schools, isLoading, error } = useSchools();
  const [showNew, setShowNew] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  return (
    <>
      <div className="section-head">
        <h2>Escolinhas</h2>
        <button onClick={() => setShowNew(true)}>+ Nova escolinha</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th><th>Status</th><th>Plano</th>
              <th>Alunos</th><th>Gestores</th><th>Professores</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} className="empty">Carregando…</td></tr>}
            {error && (
              <tr><td colSpan={7} className="empty">
                Erro: {error instanceof Error ? error.message : 'falha'}
              </td></tr>
            )}
            {schools && schools.length === 0 && (
              <tr><td colSpan={7} className="empty">Nenhuma escolinha cadastrada</td></tr>
            )}
            {schools?.map((s) => (
              <SchoolRow key={s.id} school={s} onManage={setDetailId} />
            ))}
          </tbody>
        </table>
      </div>

      {showNew && <NewSchoolModal onClose={() => setShowNew(false)} />}
      {detailId && <SchoolDetailModal schoolId={detailId} onClose={() => setDetailId(null)} />}
    </>
  );
}
