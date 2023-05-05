import Button from '@material-ui/core/Button';
import React, { useState } from 'react';

export const RetriggerButton = () => {
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover((prevHover) => !prevHover);

  return (
    <div>
      <Button
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        style={{
          width: '7rem',
          color: 'white',
          backgroundColor: hover ? 'var(--button-primary-hover-bg)' : 'var(--color-accent)',
        }}
      >
        Retrigger
      </Button>
    </div>
  );
};
