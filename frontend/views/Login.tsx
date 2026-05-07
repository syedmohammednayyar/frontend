import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { getCurrentUser, login, apiSignup, setAuthToken, setSessionUser } from '../services/api';
import LogoShield from '../components/LogoShield';
import { 
  AuthInputField, 
  AuthSelectField, 
  AuthAlert, 
  UserIcon, 
  EmailIcon, 
  LockIcon, 
  RoleIcon 
} from '../components/AuthComponents';
import './Login.css';

interface LoginProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    loginId: '',
    loginPassword: '',
    signupName: '',
    signupEmail: '',
    signupPassword: '',
    signupRole: 'Employee',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset state when switching modes
  useEffect(() => {
    setStatus(null);
    setValidationErrors({});
    setShowPassword(false);
  }, [authMode]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateSignup = useCallback(() => {
    const errors: Record<string, string> = {};
    const { signupName, signupEmail, signupPassword, signupRole } = formData;

    if (!signupName.trim() || signupName.length < 3) {
      errors.name = 'Name must be at least 3 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (signupPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (!signupRole) {
      errors.role = 'Please select a role.';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const { loginId, loginPassword } = formData;
    if (!loginId.trim() || !loginPassword.trim()) {
      setStatus({ type: 'error', message: 'Username and password are required.' });
      return;
    }

    try {
      setIsLoading(true);
      const auth = await login({ email: loginId.trim(), password: loginPassword });
      setAuthToken(auth.token);
      setSessionUser(auth.user);
      onLogin(auth.user as User);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'Login failed. Please check your credentials.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!validateSignup()) return;

    try {
      setIsLoading(true);
      await apiSignup({
        name: formData.signupName,
        email: formData.signupEmail,
        password: formData.signupPassword,
        role: formData.signupRole
      });
      
      setStatus({ type: 'success', message: 'Account created! You can now sign in.' });
      setAuthMode('login');
      // Clear sensitive signup data
      setFormData(prev => ({ ...prev, signupPassword: '' }));
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="auth-container">
      <div className="auth-background-blobs">
        <div className="blob blob-1" aria-hidden="true"></div>
        <div className="blob blob-2" aria-hidden="true"></div>
      </div>

      <div className="auth-card">
        {/* Branding Side */}
        <div className="auth-brand-section">
          <div className="brand-content">
            <div className="logo-container">
              <LogoShield size={120} />
            </div>
            <h1 className="brand-title">QUALITY MOBILES</h1>
            <p className="brand-tagline">Premium POS Management System</p>
            <div className="brand-decoration">
              <div className="decoration-line"></div>
              <p>Connecting Your ❤️ with your RABB</p>
              <div className="decoration-line"></div>
            </div>
          </div>
          <div className="brand-overlay" aria-hidden="true"></div>
        </div>

        {/* Form Side */}
        <div className="auth-form-section">
          <div className="form-header">
            <h2 className="form-title">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="form-subtitle">
              {authMode === 'login' 
                ? 'Sign in to access your workspace' 
                : 'Join Quality Mobiles network today'}
            </p>
          </div>

          <div className="auth-mode-toggle">
            <button 
              type="button"
              className={`toggle-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button 
              type="button"
              className={`toggle-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => setAuthMode('signup')}
            >
              Signup
            </button>
          </div>

          {status && <AuthAlert type={status.type} message={status.message} />}

          <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="auth-form">
            {authMode === 'signup' && (
              <AuthInputField 
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.signupName}
                onChange={(val) => updateField('signupName', val)}
                icon={<UserIcon />}
                error={validationErrors.name}
              />
            )}

            <AuthInputField 
              label={authMode === 'login' ? 'Username' : 'Email Address'}
              type={authMode === 'login' ? 'text' : 'email'}
              placeholder={authMode === 'login' ? 'Enter username' : 'john@example.com'}
              value={authMode === 'login' ? formData.loginId : formData.signupEmail}
              onChange={(val) => updateField(authMode === 'login' ? 'loginId' : 'signupEmail', val)}
              icon={authMode === 'login' ? <UserIcon /> : <EmailIcon />}
              error={validationErrors.email}
              autoComplete={authMode === 'login' ? 'username' : 'email'}
            />

            <AuthInputField 
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={authMode === 'login' ? formData.loginPassword : formData.signupPassword}
              onChange={(val) => updateField(authMode === 'login' ? 'loginPassword' : 'signupPassword', val)}
              icon={<LockIcon />}
              error={validationErrors.password}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
              isPasswordVisible={showPassword}
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
            />

            {authMode === 'signup' && (
              <AuthSelectField 
                label="Role"
                value={formData.signupRole}
                onChange={(val) => updateField('signupRole', val)}
                icon={<RoleIcon />}
                error={validationErrors.role}
                options={[
                  { label: 'Admin', value: 'Admin' },
                  { label: 'Manager', value: 'Manager' },
                  { label: 'Employee', value: 'Employee' }
                ]}
              />
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loader-container">
                  <span className="loader"></span>
                  Processing...
                </span>
              ) : (
                authMode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {authMode === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button 
                type="button" 
                className="text-toggle"
                onClick={toggleAuthMode}
              >
                {authMode === 'login' ? 'Sign up here' : 'Log in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
