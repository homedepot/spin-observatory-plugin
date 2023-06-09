import { Checkbox, TableCell, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import type { MouseEventHandler } from 'react';
import React from 'react';

import type { IExecution } from '@spinnaker/core';
import { ReactInjector } from '@spinnaker/core';

const useStyles = makeStyles({
  tableRow: {
    '&:last-child td, &:last-child th': { border: 0 },
    cursor: 'pointer',
  },
  typography: { fontSize: '1.2rem' },
  executionLink: { fontSize: '1.2rem', width: 'fit-content', color: 'var(--color-accent)' },
});

interface IExecutionRowProps {
  execution: IExecution;
  parameters: string[];
  onSelectOne: MouseEventHandler<HTMLTableRowElement>;
  isSelected: boolean;
}

const goToExecutionDetails = (executionId: string) => () => {
  const { $state, $uiRouter } = ReactInjector;
  const detailsState = $uiRouter.globals.current.name!.replace('observatory', 'pipelines.executions.execution');
  $state.go(detailsState, { executionId });
};

const convertTimestamp = (ts: number) => {
  if (!ts) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: 'numeric',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(ts);
};

export const ExecutionRow = ({ execution, parameters, onSelectOne, isSelected }: IExecutionRowProps) => {
  const styles = useStyles();
  return (
    <TableRow
      hover
      selected={isSelected}
      onClick={onSelectOne}
      style={isSelected ? { backgroundColor: 'var(--color-accent-g2)' } : {}}
      classes={{ root: styles.tableRow }}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={isSelected} style={isSelected ? { color: 'var(--color-primary-g1)' } : {}} />
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography onClick={goToExecutionDetails(execution.id)} classes={{ root: styles.executionLink }}>
          {execution.id}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: styles.typography }}>{execution.status}</Typography>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: styles.typography }}>{convertTimestamp(execution.startTime)}</Typography>
      </TableCell>
      <TableCell>
        <Typography classes={{ root: styles.typography }}>{convertTimestamp(execution.endTime)}</Typography>
      </TableCell>
      {parameters.map((p) => (
        <TableCell>
          <Typography classes={{ root: styles.typography }}>{execution.trigger.parameters![p]}</Typography>
        </TableCell>
      ))}
    </TableRow>
  );
};
