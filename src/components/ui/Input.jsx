import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Modern input classes with enhanced styling
    const baseInputClasses = "flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-100 focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-gray-300 hover:shadow-md";

    // Checkbox-specific styles with modern design
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-5 w-5 rounded-lg border-2 border-gray-300 bg-white text-orange-500 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-orange-300",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Radio button-specific styles with modern design
    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-5 w-5 rounded-full border-2 border-gray-300 bg-white text-orange-500 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-orange-300",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // For regular inputs with wrapper structure
    return (
        <div className="space-y-3">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors",
                        error ? "text-red-600" : "text-gray-700"
                    )}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    type={type}
                    className={cn(
                        baseInputClasses,
                        error && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-100",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    {...props}
                />
                
                {/* Focus indicator */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 pointer-events-none peer-focus:opacity-100"></div>
            </div>

            {description && !error && (
                <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{description}</span>
                </p>
            )}

            {error && (
                <p className="text-sm text-red-600 flex items-center space-x-1 animate-fade-in">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;