'use client';

import * as React from 'react';
import { motion, useAnimation, useInView, Variant } from 'motion/react';

import { useMounted } from '@workspace/ui/hooks/use-mounted';

const wordVariants: { [key: string]: Variant } = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

const selectionVariants: { [key: string]: Variant } = {
  initial: {
    width: 0,
    height: 0,
    opacity: 0
  },
  select: {
    width: 'calc(100% + 12px)',
    height: 'calc(100% + 12px)',
    opacity: 1,
    transition: {
      width: { duration: 0.2, ease: 'easeOut' },
      height: { duration: 0.2, ease: 'easeOut', delay: 0.2 },
      opacity: { duration: 0.3, ease: 'easeInOut' }
    }
  }
};

const cornerVariants: { [key: string]: Variant } = {
  initial: { opacity: 0, scale: 0 },
  select: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, delay: 0.4 }
  }
};

export type TextGenerateWithSelectBoxEffectProps = {
  words: string;
};

export function TextGenerateWithSelectBoxEffect({
  words
}: TextGenerateWithSelectBoxEffectProps): React.JSX.Element {
  const ref = React.useRef(null);
  const isMounted = useMounted();
  const isInView = useInView(ref, { once: true });
  const wordsArray = words.split(' ');
  const controls = useAnimation();
  const selectionControls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
      const timeoutId = setTimeout(
        () => {
          if (isMounted) {
            selectionControls.start('select');
          }
        },
        wordsArray.length * 100 + 500
      );

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, controls, selectionControls, wordsArray.length]);

  return (
    <motion.div
      ref={ref}
      className="relative inline-block"
    >
      {wordsArray.map((word, idx) => {
        const isLastWord = idx === wordsArray.length - 1;
        return (
          <React.Fragment key={word + idx}>
            <motion.span
              custom={idx}
              initial="hidden"
              animate={controls}
              variants={wordVariants}
              className="relative z-10 inline-block"
            >
              {word}
              {isLastWord && (
                <motion.div
                  className="pointer-events-none absolute left-0 top-0 size-full"
                  initial="initial"
                  animate={selectionControls}
                >
                  <motion.div
                    className="absolute -left-1.5 -top-1.5 bg-blue-100/40"
                    variants={selectionVariants}
                  />
                  <motion.div
                    className="absolute -left-1.5 -top-1.5 border border-blue-500"
                    variants={selectionVariants}
                  />
                  {/* Corner pieces */}
                  <motion.div
                    className="absolute left-[-10px] top-[-10px] size-2 origin-bottom-right rounded-full border border-blue-500 bg-white"
                    initial="initial"
                    animate={selectionControls}
                    variants={cornerVariants}
                  />
                  <motion.div
                    className="absolute right-[-10px] top-[-10px] size-2 origin-bottom-left rounded-full border border-blue-500 bg-white"
                    initial="initial"
                    animate={selectionControls}
                    variants={cornerVariants}
                  />
                  <motion.div
                    className="absolute bottom-[-10px] left-[-10px] size-2 origin-bottom-right rounded-full border border-blue-500 bg-white"
                    initial="initial"
                    animate={selectionControls}
                    variants={cornerVariants}
                  />
                  <motion.div
                    className="absolute bottom-[-10px] right-[-10px] size-2 origin-bottom-left rounded-full border border-blue-500 bg-white"
                    initial="initial"
                    animate={selectionControls}
                    variants={cornerVariants}
                  />
                </motion.div>
              )}
            </motion.span>
            {!isLastWord && <>&nbsp;</>}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
}
