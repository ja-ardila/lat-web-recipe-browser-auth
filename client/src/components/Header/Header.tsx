import { NavLink, useNavigate } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'header__nav-link header__nav-link_active'
    : 'header__nav-link';
}

function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="header__inner">
        <img src={Logo} alt="Logo de Buscador de recetas" className="header__logo" />
        <nav className="header__nav">
          {isAuthenticated ? (
            <>
              <NavLink to="/" className={getNavLinkClass}>
                Recetas
              </NavLink>
              <NavLink to="/favorites" className={getNavLinkClass}>
                Favoritos
              </NavLink>
              <p className="header__text">{currentUser?.email}</p>
              <button
                className="header__logout-btn"
                type="button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getNavLinkClass}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/register" className={getNavLinkClass}>
                Registrarse
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
