import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home" className="navbar-logo">VITAL BLOOD</Link>
        </div>
        
        <ul className="navbar-links">
          <li style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8' }}>
            Hi, {user?.name || 'User'}
          </li>
          <li>
            <Link to="/home" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/requests" className="nav-link">Requests</Link>
          </li>
          <li>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
