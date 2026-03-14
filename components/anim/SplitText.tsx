'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  once?: boolean;
  animation?: 'slideUp' | 'fadeIn' | 'scale' | 'rotate';
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  duration = 0.8,
  as: Component = 'p',
  once = true,
  animation = 'slideUp'
}: SplitTextProps) {
  // Split text into words and characters
  const words = useMemo(() => {
    return text.split(' ').map((word, wordIndex) => ({
      word,
      chars: word.split(''),
      wordIndex
    }));
  }, [text]);

  const animations = {
    slideUp: {
      hidden: { y: '100%', opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 }
    },
    rotate: {
      hidden: { rotateX: 90, opacity: 0 },
      visible: { rotateX: 0, opacity: 1 }
    }
  };

  const anim = animations[animation];

  const charTransition = {
    duration,
    ease: [0.26, 0.74, 0.18, 0.92] as const // Smooth spring-like easing
  };

  return (
    <Component className={cn('inline-flex flex-wrap', className)} aria-label={text}>
      {words.map((wordData, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em] last:mr-0">
          {wordData.chars.map((char, charIndex) => {
            const globalIndex = wordData.wordIndex + charIndex;
            const currentDelay = delay + globalIndex * stagger;

            return (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className="inline-block overflow-hidden"
                initial="hidden"
                whileInView={once ? undefined : 'visible'}
                animate="visible"
                viewport={{ once }}
                transition={{
                  staggerChildren: stagger,
                  delayChildren: currentDelay
                }}
              >
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: anim.hidden,
                    visible: anim.visible
                  }}
                  transition={charTransition}
                  style={{ willChange: 'transform, opacity' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              </motion.span>
            );
          })}
        </span>
      ))}
    </Component>
  );
}

// Word-level version for simpler animations
interface SplitWordsProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  once?: boolean;
}

export function SplitWords({
  text,
  className = '',
  delay = 0,
  stagger = 0.1,
  duration = 0.6,
  as: Component = 'p',
  once = true
}: SplitWordsProps) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <Component className={cn('inline-flex flex-wrap gap-x-[0.25em]', className)} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block overflow-hidden"
          initial="hidden"
          whileInView={once ? undefined : 'visible'}
          animate="visible"
          viewport={{ once }}
          transition={{
            staggerChildren: stagger,
            delayChildren: delay + index * stagger
          }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '100%', opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            transition={{ duration, ease: [0.26, 0.74, 0.18, 0.92] as const }}
          >
            {word}
          </motion.span>
        </motion.span>
      ))}
    </Component>
  );
}
