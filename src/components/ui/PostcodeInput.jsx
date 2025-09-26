import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../AppIcon';
import { autocompletePostcode, validatePostcode, formatPostcode, isValidPostcodeFormat } from '../../utils/postcodeService';

const PostcodeInput = ({
  label = "Postcode",
  placeholder = "Enter UK postcode",
  value = '',
  onChange,
  onValidation,
  error,
  required = false,
  disabled = false,
  className = '',
  showValidation = true,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null); // null, 'valid', 'invalid'
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced autocomplete function
  const debouncedAutocomplete = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const results = await autocompletePostcode(query);
      const formattedSuggestions = results.map(postcode => ({
        code: postcode,
        formatted: formatPostcode(postcode)
      }));
      setSuggestions(formattedSuggestions);
      setShowSuggestions(formattedSuggestions.length > 0);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Validate postcode
  const validatePostcodeValue = useCallback(async (postcodeValue) => {
    if (!postcodeValue || !postcodeValue.trim()) {
      setValidationStatus(null);
      onValidation?.(null);
      return;
    }

    // First check format
    if (!isValidPostcodeFormat(postcodeValue)) {
      setValidationStatus('invalid');
      onValidation?.(false);
      return;
    }

    if (!showValidation) {
      setValidationStatus(null);
      onValidation?.(null);
      return;
    }

    setIsValidating(true);
    
    try {
      const isValid = await validatePostcode(postcodeValue);
      setValidationStatus(isValid ? 'valid' : 'invalid');
      onValidation?.(isValid);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationStatus('invalid');
      onValidation?.(false);
    } finally {
      setIsValidating(false);
    }
  }, [showValidation, onValidation]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);

    // Clear existing timers
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced operations
    const newTimer = setTimeout(() => {
      debouncedAutocomplete(newValue);
      validatePostcodeValue(newValue);
    }, 300);

    setDebounceTimer(newTimer);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const formattedValue = suggestion.formatted;
    setInputValue(formattedValue);
    onChange?.(formattedValue);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Validate the selected postcode
    validatePostcodeValue(formattedValue);
  };

  // Handle input blur
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);

    // Format the postcode on blur
    if (inputValue) {
      const formatted = formatPostcode(inputValue);
      if (formatted !== inputValue) {
        setInputValue(formatted);
        onChange?.(formatted);
      }
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Determine input styling based on validation status
  const getInputClassName = () => {
    let baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors";
    
    if (error) {
      baseClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
    } else if (validationStatus === 'valid') {
      baseClass += " border-green-500 focus:ring-green-500 focus:border-green-500";
    } else if (validationStatus === 'invalid') {
      baseClass += " border-red-500 focus:ring-red-500 focus:border-red-500";
    } else {
      baseClass += " border-gray-300 focus:ring-blue-500 focus:border-blue-500";
    }

    if (disabled) {
      baseClass += " bg-gray-100 cursor-not-allowed";
    }

    return baseClass;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={getInputClassName()}
            {...props}
          />
          
          {/* Validation icon */}
          {showValidation && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isValidating ? (
                <Icon name="Loader2" size={16} className="text-gray-400 animate-spin" />
              ) : validationStatus === 'valid' ? (
                <Icon name="CheckCircle" size={16} className="text-green-500" />
              ) : validationStatus === 'invalid' ? (
                <Icon name="XCircle" size={16} className="text-red-500" />
              ) : null}
            </div>
          )}
        </div>

        {/* Autocomplete suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={`${suggestion.code}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{suggestion.formatted}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                        UK
                      </span>
                    </div>
                  </div>
                  <Icon name="MapPin" size={14} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}

      {/* Validation message */}
      {showValidation && validationStatus === 'invalid' && !error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>Please enter a valid UK postcode</span>
        </p>
      )}

      {showValidation && validationStatus === 'valid' && !error && (
        <p className="text-sm text-green-600 flex items-center space-x-1">
          <Icon name="CheckCircle" size={14} />
          <span>Valid UK postcode</span>
        </p>
      )}
    </div>
  );
};

export default PostcodeInput;