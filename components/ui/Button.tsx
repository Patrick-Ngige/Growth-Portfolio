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
      focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-growth focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    // Every other themed component in this codebase reads colour off the
    // CSS custom properties in globals.css (var(--background-primary) etc,
    // which already flip per theme) rather than separate dark: overrides -
    // this component previously referenced bare Tailwind classes
    // (background-primary, surface-dark, accent-growth-dark) that were
    // never defined anywhere, so none of these buttons had real styling.
    const variants = {
      primary: `
        bg-accent-growth text-[var(--background-primary)]
        hover:bg-accent-growth/90 hover:scale-[1.02]
        active:scale-[0.98]
      `,
      secondary: `
        bg-[var(--surface-color)] text-[var(--text-primary)]
        hover:bg-[var(--border-color)] hover:scale-[1.02]
        active:scale-[0.98]
      `,
      outline: `
        border-2 border-accent-growth text-accent-growth
        bg-transparent hover:bg-accent-growth hover:text-[var(--background-primary)]
        active:scale-[0.98]
      `,
      ghost: `
        text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-color)]/50
        active:scale-[0.98]
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
