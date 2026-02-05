import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { toggleTheme } from '../features/theme/themeSlice';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/feed" className="nav-logo">
          🏛️ Community Forum
        </Link>

        {user && (
          <div className="nav-menu">
            <Link to="/feed" className="nav-link">
              Feed
            </Link>
            <Link to="/new" className="nav-link">
              New Post
            </Link>
            <button className="theme-toggle" onClick={handleThemeToggle} title="Toggle theme">
              {mode === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <button className="btn btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
