import { Button, ButtonGroup } from '@material-ui/core';
import React, { useState } from 'react';

import type { IExecution } from '@spinnaker/core';

import { retriggerExecutions } from '../../services/BroadsideService';

interface IRetriggerButtonProps {
  disabled: boolean;
  executions: IExecution[];
  refreshExecutions: () => void;
}

export const RetriggerButton = ({ disabled, executions, refreshExecutions }: IRetriggerButtonProps) => {
  const [retriggerInProgress, setRetriggerInProgress] = useState(false);
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover((prevHover) => !prevHover);

  const isHovered = hover && !disabled && !retriggerInProgress;

  const handleRetrigger = () => {
    setRetriggerInProgress(true);
    retriggerExecutions({ executions })
      .then((res) => {
        // eslint-disable-next-line no-console
        console.log('retriggered: ', res);
        setRetriggerInProgress(false);
      })
      .catch((e) => {
        //TODO: surface this error
        console.error('error retriggering: ', e);
      })
      .finally(() => {
        setRetriggerInProgress(false);
        refreshExecutions();
      });
  };

  return (
    <ButtonGroup onMouseEnter={handleHover} onMouseLeave={handleHover} variant="contained" disabled={disabled}>
      <Button
        onClick={handleRetrigger}
        style={{
          width: '7rem',
          color: 'white',
          backgroundColor: isHovered ? 'var(--button-primary-hover-bg)' : 'var(--color-accent)',
        }}
      >
        Retrigger
      </Button>
    </ButtonGroup>
  );
};
