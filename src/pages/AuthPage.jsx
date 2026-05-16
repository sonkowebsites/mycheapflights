import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Chrome, Plane, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle } = useAuth();

  const isLogin = mode === 'login';
  const from = location.state?.from || '/';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    authMethod: 'email', // 'email' | 'phone'
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!isLogin && !form.name.trim()) errs.name = 'Name is required';
    if (form.authMethod === 'email') {
      if (!form.email) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    } else {
      if (!form.phone) errs.phone = 'Phone number is required';
    }
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!isLogin && form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: form.email, phone: form.phone, password: form.password });
        toast.success('Welcome back! ✈️');
      } else {
        await register({
          name: form.name,
          email: form.authMethod === 'email' ? form.email : undefined,
          phone: form.authMethod === 'phone' ? form.phone : undefined,
          password: form.password,
        });
        toast.success('Account created! Welcome aboard ✈️');
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
        <div className={styles.bgPlane}>✈</div>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className={styles.bgStar}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              '--duration': `${Math.random() * 4 + 2}s`,
              '--delay': `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.wrapper}>
        {/* Left panel - brand */}
        <div className={styles.brandPanel}>
          <Link to="/" className={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className={styles.brandContent}>
            <div className={styles.brandLogo}>
              <svg viewBox="0 0 60 60" width="60" height="60">
                <defs>
                  <linearGradient id="authLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff"/>
                    <stop offset="100%" stopColor="#7b2fff"/>
                  </linearGradient>
                </defs>
                <circle cx="30" cy="30" r="28" fill="url(#authLogo)" opacity="0.15"/>
                <circle cx="30" cy="30" r="28" fill="none" stroke="url(#authLogo)" strokeWidth="1.5"/>
                <g transform="rotate(-25 30 30)">
                  <ellipse cx="30" cy="30" rx="16" ry="4.5" fill="url(#authLogo)"/>
                  <polygon points="46,30 38,27 38,33" fill="url(#authLogo)"/>
                  <polygon points="14,30 18,30 16,22" fill="#7b2fff" opacity="0.8"/>
                  <polygon points="30,30 24,30 19,36 26,34" fill="url(#authLogo)"/>
                  <polygon points="30,30 24,30 19,24 26,26" fill="#00d4ff" opacity="0.8"/>
                </g>
                <circle cx="17" cy="18" r="6" fill="#00ffaa" opacity="0.9"/>
                <text x="17" y="21" fontFamily="Arial" fontWeight="bold" fontSize="7" fill="#000" textAnchor="middle">$</text>
              </svg>
            </div>

            <h1 className={styles.brandName}>
              MyCheap<span className="gradient-text">Flights</span>
            </h1>
            <p className={styles.brandTagline}>
              The world's smartest flight search engine
            </p>

            <div className={styles.brandFeatures}>
              {[
                { icon: '✈️', text: '800+ airlines compared' },
                { icon: '💰', text: 'Average savings of $284' },
                { icon: '🔔', text: 'Instant price drop alerts' },
                { icon: '🌍', text: '180+ countries covered' },
              ].map(f => (
                <div key={f.text} className={styles.brandFeature}>
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className={styles.bootcampBadge}>
              🇺🇸🤝🇺🇬 USA–Uganda Science &amp; Tech Bootcamp
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className={styles.formPanel}>
          <div className={`${styles.formCard} glass`}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className={styles.formSubtitle}>
                {isLogin
                  ? 'Sign in to access your saved flights and deals'
                  : 'Join millions of smart travelers worldwide'}
              </p>
            </div>

            {/* Google button */}
            <button
              className={styles.googleBtn}
              onClick={loginWithGoogle}
              type="button"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            {/* Auth method toggle (register only) */}
            {!isLogin && (
              <div className={styles.methodToggle}>
                <button
                  type="button"
                  className={`${styles.methodBtn} ${form.authMethod === 'email' ? styles.active : ''}`}
                  onClick={() => setForm(p => ({ ...p, authMethod: 'email' }))}
                >
                  <Mail size={14} /> Email
                </button>
                <button
                  type="button"
                  className={`${styles.methodBtn} ${form.authMethod === 'phone' ? styles.active : ''}`}
                  onClick={() => setForm(p => ({ ...p, authMethod: 'phone' }))}
                >
                  <Phone size={14} /> Phone
                </button>
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Name (register) */}
              {!isLogin && (
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Full Name</label>
                  <div className={styles.inputWrap}>
                    <User size={16} className={styles.inputIcon} />
                    <input
                      type="text"
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange('name')}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
                </div>
              )}

              {/* Email / Phone */}
              {(isLogin || form.authMethod === 'email') ? (
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Email Address</label>
                  <div className={styles.inputWrap}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input
                      type="email"
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
                </div>
              ) : (
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <div className={styles.inputWrap}>
                    <Phone size={16} className={styles.inputIcon} />
                    <input
                      type="tel"
                      className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && <p className={styles.errorMsg}>{errors.phone}</p>}
                </div>
              )}

              {/* Password */}
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Password</label>
                  {isLogin && (
                    <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
                  )}
                </div>
                <div className={styles.inputWrap}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
                    value={form.password}
                    onChange={handleChange('password')}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPass(v => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
              </div>

              {/* Confirm password (register) */}
              {!isLogin && (
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Confirm Password</label>
                  <div className={styles.inputWrap}>
                    <Lock size={16} className={styles.inputIcon} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword && <p className={styles.errorMsg}>{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`btn-primary ${styles.submitBtn}`}
                disabled={loading}
              >
                {loading ? (
                  <><span className={styles.spinner} /> {isLogin ? 'Signing in...' : 'Creating account...'}</>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'} <Plane size={16} /></>
                )}
              </button>
            </form>

            {/* Switch mode */}
            <p className={styles.switchText}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Link
                to={isLogin ? '/register' : '/login'}
                className={styles.switchLink}
              >
                {isLogin ? 'Sign up for free' : 'Sign in'}
              </Link>
            </p>

            <p className={styles.termsText}>
              By continuing, you agree to our{' '}
              <Link to="/terms" className={styles.termsLink}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className={styles.termsLink}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
