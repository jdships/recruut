'use client';

import * as React from 'react';
import {
  motion,
  stagger,
  useAnimate,
  type HTMLMotionProps
} from 'motion/react';

export type TextGenerateEffectProps = HTMLMotionProps<'div'> & {
  words: string;
};

export function TextGenerateEffect({
  words,
  ...other
}: TextGenerateEffectProps): React.JSX.Element {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');
  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx.toString()}
              className="opacity-0"
            >
              {word}{' '}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };
  return (
    <motion.div
      onViewportEnter={() => {
        animate(
          'span',
          {
            opacity: 1
          },
          {
            duration: 1,
            delay: stagger(0.13)
          }
        );
      }}
      {...other}
    >
      {renderWords()}
    </motion.div>
  );
}
