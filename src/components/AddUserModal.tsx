import { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { useCreateUser } from '../hooks/queries';

export function AddUserModal({ schoolId, onClose }: { schoolId: string; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'manager' | 'coach'>('manager');
  const create = useCreateUser();
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutateAsync({
        schoolId,
        body: { name: name.trim(), email: email.trim(), password, role },
      });
      toast('Usuário criado');
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha ao criar', 'err');
    }
  }

  return (
    <Modal title="Adicionar Usuário" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="au-name">Nome</label>
          <input id="au-name" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo" required />
        </div>
        <div className="form-field">
          <label htmlFor="au-email">Email</label>
          <input id="au-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="email@escola.com" required />
        </div>
        <div className="form-field">
          <label htmlFor="au-password">Senha inicial</label>
          <input id="au-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 8 caracteres" minLength={8} required />
        </div>
        <div className="form-field">
          <label htmlFor="au-role">Perfil</label>
          <select id="au-role" value={role} onChange={(e) => setRole(e.target.value as 'manager' | 'coach')}>
            <option value="manager">Gestor</option>
            <option value="coach">Professor</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Criando…' : 'Criar usuário'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
