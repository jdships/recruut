'use client';

import * as React from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  Variants,
  type HTMLMotionProps
} from 'motion/react';

export type BlurFadeProps = HTMLMotionProps<'div'> & {
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: `${number}${'px' | '%'}`;
  blur?: string;
};

export function BlurFade({
  children,
  variant,
  duration = 0.3,
  delay = 0,
  yOffset = 0,
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
  ...other
}: BlurFadeProps): React.JSX.Element {
  const ref = React.useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` }
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: 'easeOut'
        }}
        {...other}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
