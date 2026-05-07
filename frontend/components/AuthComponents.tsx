import React from 'react';

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

type IconProps = {
  size?: number;
};

const IconWrapper = ({
  children,
  size = 20,
}: React.PropsWithChildren<IconProps>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const UserIcon = () => (
  <IconWrapper>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </IconWrapper>
);

export const EmailIcon = () => (
  <IconWrapper>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22 6 12 13 2 6" />
  </IconWrapper>
);

export const LockIcon = () => (
  <IconWrapper>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconWrapper>
);

export const RoleIcon = () => (
  <IconWrapper>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </IconWrapper>
);

const EyeIcon = () => (
  <IconWrapper size={18}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </IconWrapper>
);

const EyeOffIcon = () => (
  <IconWrapper size={18}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </IconWrapper>
);

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface BaseFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  error?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

interface SelectFieldProps extends BaseFieldProps {
  options: {
    label: string;
    value: string;
  }[];
}

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                              INPUT COMPONENT                               */
/* -------------------------------------------------------------------------- */

export const AuthInputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  icon,
  error,
  autoComplete,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
}) => {
  const inputType =
    showPasswordToggle && isPasswordVisible ? 'text' : type;

  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      <label className="form-label">{label}</label>

      <div className="input-wrapper">
        <span className="input-icon">{icon}</span>

        <input
          type={inputType}
          placeholder={placeholder}
          className="form-input"
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />

        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={onTogglePassword}
            aria-label={
              isPasswordVisible
                ? 'Hide password'
                : 'Show password'
            }
          >
            {isPasswordVisible ? (
              <EyeOffIcon />
            ) : (
              <EyeIcon />
            )}
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              SELECT COMPONENT                              */
/* -------------------------------------------------------------------------- */

export const AuthSelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  icon,
  options,
  error,
}) => {
  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      <label className="form-label">{label}</label>

      <div className="input-wrapper">
        <span className="input-icon">{icon}</span>

        <select
          className="form-input role-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                ALERT COMPONENT                             */
/* -------------------------------------------------------------------------- */

export const AuthAlert: React.FC<AlertProps> = ({
  type,
  message,
}) => {
  return (
    <div
      className={`auth-alert alert-${type}`}
      role="alert"
    >
      {message}
    </div>
  );
};