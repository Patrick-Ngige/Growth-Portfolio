'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate, animate } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  duration?: number;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 35,
  duration = 0.4,
  onClick
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = {
    duration,
    easing: [0.26, 0.74, 0.18, 0.92] // Bouncy spring effect
  };

  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const transform = useMotionTemplate`translate(${xSpring}px, ${ySpring}px)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Only apply magnetic effect when hovering
      if (isHovered) {
        x.set(distanceX * 0.3);
        y.set(distanceY * 0.3);
      } else {
        x.set(distanceX * 0.05);
        y.set(distanceY * 0.05);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseenter', () => setIsHovered(true));
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseenter', () => setIsHovered(true));
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [x, y, isHovered]);

  // motion.div, not motion.button: every real call site wraps this around
  // its own <Button> (or a plain <a>), so a motion.button here nested a
  // real <button> element inside another one - invalid HTML, and browsers
  // handle it inconsistently. The actual click handling and button
  // semantics belong to the child; this wrapper only owns the magnetic
  // transform.
  return (
    <motion.div
      ref={ref}
      className={`relative inline-block ${className}`}
      style={{
        transform,
        cursor: 'pointer'
      }}
      onClick={onClick}
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.98
      }}
    >
      {children}
    </motion.div>
  );
}
