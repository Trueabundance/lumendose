import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon,
    disabled,
    ...props
}) => {
    const baseStyles = "font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40",
        secondary: "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg shadow-red-500/20",
        ghost: "bg-transparent hover:bg-white/10 text-gray-300 hover:text-white",
        premium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 shadow-lg shadow-yellow-500/20 border border-yellow-400/20"
    };

    const sizes = {
        sm: "py-1 px-3 text-sm",
        md: "py-2 px-4 text-base",
        lg: "py-3 px-6 text-lg"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : icon}
            {children}
        </button>
    );
};
