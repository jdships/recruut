import * as React from 'react';

import { APP_DESCRIPTION, APP_NAME } from '@workspace/common/app';

export function OgImage(): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        color: 'white',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          bottom: '24px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px'
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '48px',
          maxWidth: '800px',
          zIndex: '10'
        }}
      >
        <div
          style={{
            fontSize: '72px',
            fontWeight: '800',
            lineHeight: '1.2',
            color: '#f8f8f8',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
          }}
        >
          {APP_NAME}
        </div>

        <div
          style={{
            marginTop: '24px',
            fontSize: '28px',
            fontWeight: '400',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.75)'
          }}
        >
          {APP_DESCRIPTION}
        </div>
      </div>

      {[
        { top: '24px', left: '24px' },
        { top: '24px', right: '24px' },
        { bottom: '24px', left: '24px' },
        { bottom: '24px', right: '24px' }
      ].map((position, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#f8f8f8',
            ...position
          }}
        />
      ))}
    </div>
  );
}
