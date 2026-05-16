import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, User, LogOut, Settings, Bell, Plane } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Search Flights' },
    { to: '/deals', label: 'Deals' },
    { to: '/guide', label: 'How to Book' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 40 40" width="40" height="40">
              <defs>
                <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff"/>
                  <stop offset="100%" stopColor="#7b2fff"/>
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="19" fill="url(#navLogoGrad)" opacity="0.15"/>
              <circle cx="20" cy="20" r="19" fill="none" stroke="url(#navLogoGrad)" strokeWidth="1.5"/>
              <g transform="rotate(-25 20 20)">
                <ellipse cx="20" cy="20" rx="11" ry="3" fill="url(#navLogoGrad)"/>
                <polygon points="31,20 26,18 26,22" fill="url(#navLogoGrad)"/>
                <polygon points="12,20 15,20 13,15" fill="#7b2fff" opacity="0.8"/>
                <polygon points="20,20 16,20 13,24 18,23" fill="url(#navLogoGrad)"/>
                <polygon points="20,20 16,20 13,16 18,17" fill="#00d4ff" opacity="0.8"/>
              </g>
              <circle cx="11" cy="13" r="4" fill="#00ffaa" opacity="0.9"/>
              <text x="11" y="16" fontFamily="Arial" fontWeight="bold" fontSize="5" fill="#000" textAnchor="middle">$</text>
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>MyCheap</span>
            <span className={styles.logoAccent}>Flights</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className={styles.navLinks}>
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className={styles.actions}>
          {/* Theme toggle */}
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <div className={styles.themeToggle}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </div>
          </button>

          {isAuthenticated ? (
            <>
              <button className={styles.iconBtn} aria-label="Notifications">
                <Bell size={18} />
                <span className={styles.notifDot} />
              </button>
              <div className={styles.userMenuWrap}>
                <button
                  className={styles.userBtn}
                  onClick={() => setUserMenuOpen(v => !v)}
                >
                  <div className={styles.avatar}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className={`${styles.userMenu} glass`}>
                    <Link to="/profile" className={styles.userMenuItem}>
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/bookings" className={styles.userMenuItem}>
                      <Plane size={15} /> My Bookings
                    </Link>
                    <Link to="/settings" className={styles.userMenuItem}>
                      <Settings size={15} /> Settings
                    </Link>
                    <div className={styles.userMenuDivider} />
                    <button className={`${styles.userMenuItem} ${styles.logoutBtn}`} onClick={logout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className={`${styles.iconBtn} ${styles.hamburger}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''} glass`}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`${styles.mobileLink} ${location.pathname === link.to ? styles.active : ''}`}
          >
            {link.label}
          </Link>
        ))}
        {!isAuthenticated && (
          <div className={styles.mobileAuth}>
            <Link to="/login" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Sign In</Link>
            <Link to="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
