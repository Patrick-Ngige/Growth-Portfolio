'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxItemProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  horizontal?: boolean;
  reverse?: boolean;
}

export default function ParallaxItem({
  children,
  speed = 0.5,
  className = '',
  horizontal = false,
  reverse = false
}: ParallaxItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Calculate movement range based on speed
  const movementRange = speed * 100;
  const direction = reverse ? -1 : 1;

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [movementRange * direction, -movementRange * direction]
  );

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [horizontal ? movementRange * direction : 0, horizontal ? -movementRange * direction : 0]
  );

  // Add spring physics for smoother movement
  const smoothY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const smoothX = useSpring(x, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform: horizontal
          ? `translateX(${smoothX}px)`
          : `translateY(${smoothY}px)`
      }}
    >
      {children}
    </motion.div>
  );
}

// Hook version for more control
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 50, -speed * 50]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return { ref, y: smoothY };
}
