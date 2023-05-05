import Grid from '@material-ui/core/Grid';
import type { ReactNode } from 'react';
import React, { Children } from 'react';

interface IActionButtonsContainerProps {
  children: NonNullable<ReactNode>;
}

export const ActionButtonsContainer = ({ children }: IActionButtonsContainerProps) => {
  const childrenArr = Children.toArray(children);
  return (
    <Grid container direction="row" alignItems="flex-start" spacing={2}>
      {childrenArr.map((child) => (
        <Grid item>{child}</Grid>
      ))}
    </Grid>
  );
};
