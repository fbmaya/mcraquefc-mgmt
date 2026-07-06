import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-brand">
          <img src="/assets/logo.png" alt="Meu Craque FC" />
          <span>Meu Craque FC</span>
          <span className="accent">Admin</span>
        </div>
        <div className="topbar-right">
          {user && <span className="topbar-user">{user.name}</span>}
          <button className="logout-btn" onClick={onLogout}>Sair</button>
        </div>
      </header>
      <nav className="nav-tabs">
        <NavLink className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')} to="/" end>
          Visão Geral
        </NavLink>
        <NavLink className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')} to="/escolinhas">
          Escolinhas
        </NavLink>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
