import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  success?: string;
  info?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  success,
  info,
  required = false,
  placeholder,
  disabled = false,
  className,
  min,
  max,
  step,
  pattern,
  maxLength,
  minLength,
  autoComplete,
  autoFocus = false,
  readOnly = false,
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  validation,
  onBlur,
  onFocus,
  onKeyDown,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
    
    // Real-time validation
    if (validation) {
      const error = validateInput(e.target.value, validation);
      setValidationError(error);
    }
  };

  const validateInput = (value: string, rules: NonNullable<FormInputProps['validation']>): string | null => {
    if (rules.required && !value.trim()) {
      return 'This field is required';
    }
    
    if (rules.min && value.length < rules.min) {
      return `Minimum length is ${rules.min} characters`;
    }
    
    if (rules.max && value.length > rules.max) {
      return `Maximum length is ${rules.max} characters`;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }
    
    if (rules.custom) {
      return rules.custom(value);
    }
    
    return null;
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const getInputType = () => {
    if (type === 'password' && showPasswordToggle) {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const getStatusIcon = () => {
    if (error || validationError) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (success) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (info) {
      return <Info className="h-4 w-4 text-blue-500" />;
    }
    return null;
  };

  const getStatusColor = () => {
    if (error || validationError) {
      return 'border-red-500 focus:ring-red-500 focus:border-red-500';
    }
    if (success) {
      return 'border-green-500 focus:ring-green-500 focus:border-green-500';
    }
    if (isFocused) {
      return 'border-bright-green focus:ring-bright-green focus:border-bright-green';
    }
    return 'border-gray-300 dark:border-gray-600 focus:ring-bright-green focus:border-bright-green';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
        {info && <Info className="h-3 w-3 text-gray-400" />}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-700 dark:text-blue-400">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type={getInputType()}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          maxLength={maxLength}
          minLength={minLength}
          className={clsx(
            'w-full px-3 py-3 rounded-lg transition-all duration-200',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-opacity-50',
            getStatusColor(),
            leftIcon && 'pl-10',
            (rightIcon || showPasswordToggle || getStatusIcon()) && 'pr-10',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800',
            readOnly && 'bg-gray-50 dark:bg-gray-800 cursor-default',
            error || validationError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          )}
        />

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {getStatusIcon()}
          {rightIcon && (
            <div className="text-gray-600 dark:text-gray-400">
              {rightIcon}
            </div>
          )}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-1">
        {(error || validationError) && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{error || validationError}</span>
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>{success}</span>
          </p>
        )}
        {info && !error && !validationError && (
          <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center space-x-1">
            <Info className="h-3 w-3" />
            <span>{info}</span>
          </p>
        )}
      </div>

      {/* Character Count */}
      {maxLength && typeof value === 'string' && (
        <div className="text-right">
          <span className={clsx(
            'text-xs',
            value.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          )}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};