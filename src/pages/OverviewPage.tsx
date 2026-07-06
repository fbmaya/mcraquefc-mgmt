import { useOverview } from '../hooks/queries';

const PLAN_BADGE: Record<string, string> = {
  trial: 'badge-yellow',
  starter: 'badge-blue',
  pro: 'badge-green',
  elite: 'badge-blue',
};

export function OverviewPage() {
  const { data, isLoading, error } = useOverview();

  if (isLoading) return <p className="loading">Carregando…</p>;
  if (error) return <p className="empty">Erro: {error instanceof Error ? error.message : 'falha'}</p>;
  if (!data) return null;

  const plans = Object.entries(data.licenses_by_plan);

  return (
    <>
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Escolinhas ativas</div>
          <div className="kpi-value green">{data.active_schools}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total escolinhas</div>
          <div className="kpi-value">{data.total_schools}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Alunos cadastrados</div>
          <div className="kpi-value">{data.total_students}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Usuários ativos</div>
          <div className="kpi-value">{data.total_users}</div>
        </div>
      </div>

      <div className="section-head"><h2>Distribuição de planos</h2></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Plano</th><th>Qtd</th></tr></thead>
          <tbody>
            {plans.length ? (
              plans.map(([plan, count]) => (
                <tr key={plan}>
                  <td><span className={`badge ${PLAN_BADGE[plan] ?? 'badge-gray'}`}>{plan}</span></td>
                  <td>{count}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={2} className="empty">Sem dados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
