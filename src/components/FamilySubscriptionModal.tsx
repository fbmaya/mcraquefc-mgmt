import { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { useCreateSubscription } from '../hooks/queries';
import type { FamilyPriceTier } from '../api/types';

export function FamilySubscriptionModal({ schoolId, onClose }: { schoolId: string; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<FamilyPriceTier>('cheio');
  const [expiresAt, setExpiresAt] = useState('');
  const create = useCreateSubscription();
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutateAsync({
        schoolId,
        body: { parent_email: email.trim(), price_tier: tier, expires_at: expiresAt || null },
      });
      toast('Assinatura Family criada');
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha ao criar', 'err');
    }
  }

  return (
    <Modal title="Nova assinatura Family" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="fs-email">E-mail do responsável</label>
          <input id="fs-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="responsavel@email.com" required />
        </div>
        <div className="form-field">
          <label htmlFor="fs-tier">Faixa de preço</label>
          <select id="fs-tier" value={tier} onChange={(e) => setTier(e.target.value as FamilyPriceTier)}>
            <option value="cheio">Cheio (R$ 25)</option>
            <option value="pontualidade">Pontualidade (R$ 20)</option>
            <option value="promo">Promo (R$ 15)</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="fs-expires">Vence em</label>
          <input id="fs-expires" type="date" value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Criando…' : 'Criar assinatura'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
