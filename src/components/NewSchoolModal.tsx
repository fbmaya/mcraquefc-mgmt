import { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { useCreateSchool } from '../hooks/queries';

export function NewSchoolModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const create = useCreateSchool();
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutateAsync({ name: name.trim() });
      toast('Escolinha criada com licença trial');
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha ao criar', 'err');
    }
  }

  return (
    <Modal title="Nova Escolinha" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="ns-name">Nome da escolinha</label>
          <input
            id="ns-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Arena Kids FC"
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" className="ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Criando…' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
