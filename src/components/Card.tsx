import type { HTMLAttributes, FC } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const Card: FC<CardProps> = ({ children, className, hoverEffect = false, ...props }) => {
    return (
        <div
            className={cn(
                "bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl",
                hoverEffect && "transition-transform hover:scale-[1.02] hover:bg-gray-800/70",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
