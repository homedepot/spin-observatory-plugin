import Button from '@material-ui/core/Button';
import React from 'react';
import './RetriggerButton.module.scss';

export const RetriggerButton = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => {
  return (
    <Button className={'retrigger-button'} disabled={disabled} onClick={onClick}>
      Retrigger
    </Button>
  );
};
