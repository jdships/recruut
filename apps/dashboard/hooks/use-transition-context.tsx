'use client';

import * as React from 'react';

const TransitionContext = React.createContext<{
  isLoading: boolean;
  startTransition: React.TransitionStartFunction;
}>({ isLoading: false, startTransition: () => {} });

export const TransitionProvider = ({ children }: React.PropsWithChildren) => {
  const transition = React.useTransition();
  return (
    <TransitionContext.Provider
      value={{
        isLoading: transition[0],
        startTransition: transition[1]
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export function useTransitionContext() {
  const context = React.useContext(TransitionContext);
  if (context === undefined) {
    throw new Error(
      'useTransitionContext must be used within an TransitionContext'
    );
  }
  return context;
}
