'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium
      transition-all duration-300 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth-dark focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      primary: `
        bg-accent-growth-dark text-background-primary
        hover:bg-accent-growth-light hover:scale-[1.02]
        active:scale-[0.98]
        dark:bg-accent-growth-dark dark:text-background-primary
      `,
      secondary: `
        bg-surface-dark text-text-primary-dark
        hover:bg-gray-600 hover:scale-[1.02]
        active:scale-[0.98]
        dark:bg-surface-dark dark:text-text-primary-dark
      `,
      outline: `
        border-2 border-accent-growth-dark text-accent-growth-dark
        bg-transparent hover:bg-accent-growth-dark hover:text-background-primary
        active:scale-[0.98]
        dark:border-accent-growth-dark dark:text-accent-growth-dark
      `,
      ghost: `
        text-text-secondary hover:text-text-primary hover:bg-surface-dark/50
        active:scale-[0.98]
        dark:text-text-secondary-dark dark:hover:bg-surface-dark/50
      `,
    };

    const sizes = {
      sm: 'text-sm px-4 py-2 rounded-md',
      md: 'text-base px-6 py-3 rounded-lg',
      lg: 'text-lg px-8 py-4 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Animated Button with Framer Motion
interface AnimatedButtonProps extends ButtonProps {
  containerClass?: string;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ containerClass, children, ...props }, ref) => {
    return (
      <motion.div
        className={cn('inline-block', containerClass)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Button ref={ref} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
