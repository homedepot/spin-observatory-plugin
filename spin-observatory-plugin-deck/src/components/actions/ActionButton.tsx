import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';

interface IActionButtonProps {
  action: () => void;
  disabled: boolean;
  tooltip: string;
  title: string;
}

export const ActionButton = ({ action, disabled, tooltip, title }: IActionButtonProps) => {
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover((prevHover) => !prevHover);

  const computeBtnColor = () => {
    if (disabled) {
      return 'var(--color-status-inactive)';
    } else if (hover) {
      return 'var(--button-primary-hover-bg)';
    } else {
      return 'var(--color-accent)';
    }
  };

  return (
    <Tooltip title={<Typography>{tooltip}</Typography>}>
      <ButtonGroup onMouseEnter={handleHover} onMouseLeave={handleHover} variant="contained" disabled={disabled}>
        <Button
          onClick={action}
          style={{
            width: '7rem',
            color: 'white',
            backgroundColor: computeBtnColor(),
          }}
        >
          {title}
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};
