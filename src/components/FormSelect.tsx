import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Search, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  success?: string;
  info?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onSearch?: (query: string) => void;
  onCreate?: (value: string) => void;
  validation?: {
    required?: boolean;
    custom?: (value: string) => string | null;
  };
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  success,
  info,
  required = false,
  placeholder = 'Select an option...',
  disabled = false,
  className,
  searchable = false,
  clearable = false,
  multiple = false,
  loading = false,
  emptyMessage = 'No options available',
  leftIcon,
  rightIcon,
  onSearch,
  onCreate,
  validation: _validation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected option(s)
  const selectedOption = options.find(option => option.value === value);
  const selectedOptions = multiple 
    ? options.filter(option => value.split(',').includes(option.value))
    : [selectedOption].filter(Boolean);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = value ? value.split(',') : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues.join(','));
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setValidationError(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleCreate = () => {
    if (searchQuery && onCreate) {
      onCreate(searchQuery);
      setSearchQuery('');
    }
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
    if (isFocused || isOpen) {
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

      {/* Select Container */}
      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={clsx(
            'w-full px-3 py-3 rounded-lg transition-all duration-200',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-opacity-50',
            'flex items-center justify-between',
            getStatusColor(),
            leftIcon && 'pl-10',
            (rightIcon || clearable || getStatusIcon()) && 'pr-10',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800',
            error || validationError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          )}
        >
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-700 dark:text-blue-400">
              {leftIcon}
            </div>
          )}

          {/* Selected Value */}
          <div className="flex-1 text-left">
            {multiple ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map((option) => (
                  <span
                    key={option?.value}
                    className="inline-flex items-center px-2 py-1 bg-bright-green text-white text-xs rounded-md"
                  >
                    {option?.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option?.value || '');
                      }}
                      className="ml-1 hover:bg-green-600 rounded-full p-0.5"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </span>
                ))}
                {selectedOptions.length === 0 && (
                  <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
                )}
              </div>
            ) : (
              <span className={selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            {rightIcon && (
              <div className="text-gray-600 dark:text-gray-400">
                {rightIcon}
              </div>
            )}
            {clearable && value && (
              <button
                onClick={handleClear}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className={clsx(
              'h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-hidden">
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-bright-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bright-green mx-auto"></div>
                  <p className="mt-2 text-sm">Loading...</p>
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={clsx(
                      'w-full px-3 py-2 text-left text-sm transition-colors',
                      'hover:bg-gray-100 dark:hover:bg-gray-700',
                      'flex items-center space-x-3',
                      option.disabled && 'opacity-50 cursor-not-allowed',
                      multiple && value.split(',').includes(option.value) && 'bg-bright-green text-white hover:bg-green-600',
                      !multiple && value === option.value && 'bg-bright-green text-white hover:bg-green-600'
                    )}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {!multiple && value === option.value && (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm">{emptyMessage}</p>
                  {searchQuery && onCreate && (
                    <button
                      onClick={handleCreate}
                      className="mt-2 text-sm text-bright-green hover:text-green-600 font-medium"
                    >
                      Create "{searchQuery}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
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
    </div>
  );
};