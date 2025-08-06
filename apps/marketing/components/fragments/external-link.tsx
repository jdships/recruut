import * as React from 'react';

export function ExternalLink(
  props: React.SVGProps<SVGSVGElement>
): React.JSX.Element {
  return (
    <svg
      width="6"
      height="6"
      viewBox="0 0 6 6"
      {...props}
    >
      <path
        fill="currentColor"
        d="M1.252 5.547l-.63-.63 3.16-3.161H1.383L1.39.891h3.887v3.89h-.87l.005-2.396-3.159 3.162z"
      />
    </svg>
  );
}
