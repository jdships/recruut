import * as React from 'react';

import { Button, type ButtonProps } from '@workspace/ui/components/button';

export type NextButtonProps = ButtonProps & {
  isLastStep: boolean;
};

export function NextButton({
  isLastStep,
  ...rest
}: NextButtonProps): React.JSX.Element {
  return (
    <div>
      <Button
        type="button"
        variant="default"
        className="mt-4"
        {...rest}
      >
        {isLastStep ? 'Finish' : 'Next step →'}
      </Button>
    </div>
  );
}
