import { TableCell, TableRow, Typography, Checkbox } from '@material-ui/core';
import React, { MouseEventHandler } from 'react';
import { IExecution, ReactInjector } from '@spinnaker/core';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  tableRow: { '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' },
  typography: { fontSize: '1.2rem' },
  executionLink: { fontSize: '1.2rem', color: '#139cb5', width: 'fit-content' },
});

interface IExecutionRowProps {
  execution: IExecution;
  parameters: string[];
  onSelectOne: MouseEventHandler<HTMLTableRowElement>;
  isSelected: boolean;
  inProgress: boolean;
}

const goToExecutionDetails = (executionId: string) => () => {
  const { $state, $uiRouter } = ReactInjector;
  const detailsState = $uiRouter.globals.current.name!.replace('observatory', 'pipelines.executions.execution');
  $state.go(detailsState, { executionId });
};

const convertTimestamp = (ts: number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: 'numeric',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(ts);
};

export const ExecutionRow = ({ execution, parameters, onSelectOne, isSelected, inProgress }: IExecutionRowProps) => {
  const styles = useStyles();
  return (
    <TableRow hover selected={isSelected} onClick={onSelectOne} classes={{ root: styles.tableRow }}>
      <TableCell padding="checkbox">
        <Checkbox color="primary" checked={isSelected} />
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
      {!inProgress && (
        <TableCell>
          <Typography classes={{ root: styles.typography }}>{convertTimestamp(execution.endTime)}</Typography>
        </TableCell>
      )}
      {parameters.map((p) => (
        <TableCell>
          <Typography classes={{ root: styles.typography }}>{execution.trigger.parameters![p]}</Typography>
        </TableCell>
      ))}
    </TableRow>
  );
};
