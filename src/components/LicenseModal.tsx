import { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { useUpdateLicense } from '../hooks/queries';
import type { License, PlanType, LicenseStatus } from '../api/types';

export function LicenseModal({
  schoolId,
  license,
  onClose,
}: {
  schoolId: string;
  license: License | null;
  onClose: () => void;
}) {
  const [plan, setPlan] = useState<PlanType>(license?.plan ?? 'trial');
  const [status, setStatus] = useState<LicenseStatus>(license?.status ?? 'active');
  const [maxStudents, setMaxStudents] = useState(String(license?.max_students ?? 30));
  const [maxCoaches, setMaxCoaches] = useState(String(license?.max_coaches ?? 2));
  const [familyIncluded, setFamilyIncluded] = useState(license?.family_included ?? false);
  const [familyPrice, setFamilyPrice] = useState(
    license?.family_price_per_student != null ? String(license.family_price_per_student) : '',
  );
  const [familySeats, setFamilySeats] = useState(
    license?.family_seats != null ? String(license.family_seats) : '',
  );
  const [expiresAt, setExpiresAt] = useState(license?.expires_at ?? '');
  const update = useUpdateLicense();
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await update.mutateAsync({
        schoolId,
        body: {
          plan,
          status,
          max_students: parseInt(maxStudents, 10) || 30,
          max_coaches: parseInt(maxCoaches, 10) || 2,
          family_included: familyIncluded,
          family_price_per_student: familyPrice ? parseFloat(familyPrice) : null,
          family_seats: familySeats ? parseInt(familySeats, 10) : null,
          expires_at: expiresAt || null,
        },
      });
      toast('Licença atualizada');
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha ao salvar', 'err');
    }
  }

  return (
    <Modal title="Editar Licença" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="lic-plan">Plano</label>
          <select id="lic-plan" value={plan} onChange={(e) => setPlan(e.target.value as PlanType)}>
            <option value="trial">Trial</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="elite">Elite</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="lic-status">Status</label>
          <select id="lic-status" value={status} onChange={(e) => setStatus(e.target.value as LicenseStatus)}>
            <option value="active">Ativa</option>
            <option value="suspended">Suspensa</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="lic-max-students">Máx. alunos</label>
            <input id="lic-max-students" type="number" min="1" value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="lic-max-coaches">Máx. professores</label>
            <input id="lic-max-coaches" type="number" min="1" value={maxCoaches}
              onChange={(e) => setMaxCoaches(e.target.value)} />
          </div>
        </div>
        <p className="subhead">Family (acesso pago dos responsáveis)</p>
        <div className="form-field">
          <label htmlFor="lic-family-included">
            <input id="lic-family-included" type="checkbox" checked={familyIncluded}
              onChange={(e) => setFamilyIncluded(e.target.checked)} />
            {' '}Family incluso no plano (acesso automático p/ todos os alunos ativos)
          </label>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="lic-family-price">Preço por aluno (R$)</label>
            <input id="lic-family-price" type="number" min="0" step="0.01" value={familyPrice}
              placeholder="—" onChange={(e) => setFamilyPrice(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="lic-family-seats">Cota contratada</label>
            <input id="lic-family-seats" type="number" min="0" value={familySeats}
              placeholder="ilimitado" onChange={(e) => setFamilySeats(e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="lic-expires">Expira em</label>
          <input id="lic-expires" type="date" value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" disabled={update.isPending}>
            {update.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
