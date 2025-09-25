import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus-visible:ring-orange-200 shadow-lg hover:shadow-xl",
                destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus-visible:ring-red-200 shadow-lg hover:shadow-xl",
                outline: "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-orange-300 focus-visible:ring-orange-100 shadow-md hover:shadow-lg",
                secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 focus-visible:ring-gray-200 shadow-md hover:shadow-lg",
                ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus-visible:ring-gray-200",
                link: "text-orange-600 underline-offset-4 hover:underline hover:text-orange-700 focus-visible:ring-orange-200",
                success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus-visible:ring-green-200 shadow-lg hover:shadow-xl",
                warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 focus-visible:ring-yellow-200 shadow-lg hover:shadow-xl",
                danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus-visible:ring-red-200 shadow-lg hover:shadow-xl",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 rounded-lg px-4 text-sm",
                lg: "h-14 rounded-xl px-8 text-base",
                icon: "h-12 w-12",
                xs: "h-8 rounded-lg px-3 text-xs",
                xl: "h-16 rounded-xl px-12 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({
    className,
    variant,
    size,
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = null,
    fullWidth = false,
    disabled = false,
    ...props
}, ref) => {
    const Comp = asChild ? Slot : "button";

    // Icon size mapping based on button size
    const iconSizeMap = {
        xs: 14,
        sm: 16,
        default: 18,
        lg: 20,
        xl: 24,
        icon: 18,
    };

    const calculatedIconSize = iconSize || iconSizeMap?.[size] || 18;

    // Enhanced loading spinner with modern design
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    const renderIcon = () => {
        if (!iconName) return null;
        try {
            return (
                <Icon
                    name={iconName}
                    size={calculatedIconSize}
                    className={cn(
                        "transition-transform duration-200",
                        children && iconPosition === 'left' && "mr-2",
                        children && iconPosition === 'right' && "ml-2"
                    )}
                />
            );
        } catch {
            return null;
        }
    };

    const renderFallbackButton = () => (
        <button
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full",
                loading && "cursor-wait"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            <div className="flex items-center justify-center relative">
                {loading && <LoadingSpinner />}
                {iconName && iconPosition === 'left' && !loading && renderIcon()}
                {children && (
                    <span className={cn(
                        "transition-all duration-200",
                        loading && "opacity-70"
                    )}>
                        {children}
                    </span>
                )}
                {iconName && iconPosition === 'right' && !loading && renderIcon()}
            </div>
        </button>
    );

    // When asChild is true, merge icons into the child element
    if (asChild) {
        try {
            if (!children || React.Children?.count(children) !== 1) {
                return renderFallbackButton();
            }

            const child = React.Children?.only(children);

            if (!React.isValidElement(child)) {
                return renderFallbackButton();
            }
            const content = (
                <div className="flex items-center justify-center relative">
                    {loading && <LoadingSpinner />}
                    {iconName && iconPosition === 'left' && !loading && renderIcon()}
                    {child?.props?.children && (
                        <span className={cn(
                            "transition-all duration-200",
                            loading && "opacity-70"
                        )}>
                            {child?.props?.children}
                        </span>
                    )}
                    {iconName && iconPosition === 'right' && !loading && renderIcon()}
                </div>
            );

            const clonedChild = React.cloneElement(child, {
                className: cn(
                    buttonVariants({ variant, size, className }),
                    fullWidth && "w-full",
                    loading && "cursor-wait",
                    child?.props?.className
                ),
                disabled: disabled || loading || child?.props?.disabled,
                children: content,
            });

            return <Comp ref={ref} {...props}>{clonedChild}</Comp>;
        } catch {
            return renderFallbackButton();
        }
    }

    return (
        <Comp
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full",
                loading && "cursor-wait"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            <div className="flex items-center justify-center relative">
                {loading && <LoadingSpinner />}
                {iconName && iconPosition === 'left' && !loading && renderIcon()}
                {children && (
                    <span className={cn(
                        "transition-all duration-200",
                        loading && "opacity-70"
                    )}>
                        {children}
                    </span>
                )}
                {iconName && iconPosition === 'right' && !loading && renderIcon()}
            </div>
        </Comp>
    );
});

Button.displayName = "Button";
export default Button;