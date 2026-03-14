'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export default function Counter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  delay = 0,
  className = ''
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const startValue = 0;
    const endValue = value;
    const startTime = Date.now() + delay * 1000;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    // Small delay before starting
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [value, duration, delay, isInView]);

  const formattedValue = displayValue.toLocaleString('en-US', {
    maximumFractionDigits: displayValue % 1 === 0 ? 0 : 1
  });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
}
