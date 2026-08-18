import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
  rightElement?: React.ReactNode;
}

const AuthField: React.FC<AuthFieldProps> = ({
  label,
  error,
  icon: Icon,
  helperText,
  rightElement,
  className = '',
  type = 'text',
  ...props
}) => {
  const inputClasses = `
    block w-full px-3 py-2.5 border rounded-xl
    placeholder-smoke focus:outline-none focus:ring-2
    disabled:bg-mist/30 disabled:text-smoke disabled:cursor-not-allowed
    transition-colors
    ${error
      ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
      : 'border-fog focus:ring-fiverr-green/30 focus:border-fiverr-green'
    }
    ${Icon ? 'pl-10' : ''}
    ${rightElement ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-carbon mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-smoke" />
          </div>
        )}
        <input type={type} className={inputClasses} {...props} />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-smoke">{helperText}</p>
      )}
    </div>
  );
};

export default AuthField;
