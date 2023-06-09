import { Button, ButtonGroup } from '@material-ui/core';
import React, { useState } from 'react';

import type { IExecution } from '@spinnaker/core';

import { broadside } from '../../services/';

interface IRetriggerButtonProps {
  executions: IExecution[];
  refreshExecutions: () => void;
}

export const RetriggerButton = ({ executions, refreshExecutions }: IRetriggerButtonProps) => {
  const [retriggerInProgress, setRetriggerInProgress] = useState(false);
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover((prevHover) => !prevHover);

  const disabled = executions.length === 0 || retriggerInProgress;

  const handleRetrigger = () => {
    setRetriggerInProgress(true);
    broadside
      .retriggerExecutions({ executions })
      .then((res) => {
        /* eslint-disable no-console */
        console.log(res.status);
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((e) => console.error('error retriggering: ', e))
      .finally(() => {
        setRetriggerInProgress(false);
        refreshExecutions();
      });
  };

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
    <ButtonGroup onMouseEnter={handleHover} onMouseLeave={handleHover} variant="contained" disabled={disabled}>
      <Button
        onClick={handleRetrigger}
        style={{
          width: '7rem',
          color: 'white',
          backgroundColor: computeBtnColor(),
        }}
      >
        Retrigger
      </Button>
    </ButtonGroup>
  );
};
