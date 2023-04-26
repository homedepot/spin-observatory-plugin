import { TableCell, TableRow, Typography, Checkbox } from '@mui/material';
import React, { MouseEventHandler } from 'react';
import { IExecution, ReactInjector } from '@spinnaker/core';

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
  return (
    <TableRow
      hover
      selected={isSelected}
      onClick={onSelectOne}
      sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
    >
      <TableCell padding="checkbox">
        <Checkbox color="primary" checked={isSelected} />
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography color="#139cb5" onClick={goToExecutionDetails(execution.id)} width="fit-content">
          {execution.id}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{execution.status}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{convertTimestamp(execution.startTime)}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{convertTimestamp(execution.endTime)}</Typography>
      </TableCell>
      {parameters.map((p) => (
        <TableCell>
          <Typography>{execution.trigger.parameters![p]}</Typography>
        </TableCell>
      ))}
    </TableRow>
  );
};
