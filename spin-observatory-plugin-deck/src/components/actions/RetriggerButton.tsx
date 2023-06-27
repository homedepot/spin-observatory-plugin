import { Button, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  'retrigger-button': {
    width: '7rem',
    color: '#fff',
    backgroundColor: 'var(--color-accent)',
  },
  'retrigger-button:hover': {
    backgroundColor: 'var(--button-primary-hover-bg)',
  },
});

export const RetriggerButton = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => {
  const styles = useStyles();
  return <Button className={styles['retrigger-button']}>Retrigger</Button>;
};
