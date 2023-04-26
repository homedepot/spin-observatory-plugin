import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
} from '@mui/material';
import React from 'react';

import type { IExecution } from '@spinnaker/core';
import type { IStatus } from './status';

interface IPipelineExecutionsProps {
  executions: IExecution[];
  parameters: string[];
  status: IStatus;
}

interface ITableHeadersProps {
  headers: string[];
}

interface IExecutionRowProps {
  execution: IExecution;
  parameters: string[];
}

const TableHeaders = ({ headers }: ITableHeadersProps) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            // checked={rowCount > 0 && numSelected === rowCount}
            // onChange={onSelectAllClick}
          />
        </TableCell>
        {['ID', 'Start Time', 'End Time', ...headers].map((h) => (
          <TableCell>
            <Typography variant="h6">{h}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const ExecutionRow = ({ execution, parameters }: IExecutionRowProps) => {
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          // checked={rowCount > 0 && numSelected === rowCount}
          // onChange={onSelectAllClick}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        {execution.id}
      </TableCell>
      <TableCell>{convertTimestamp(execution.startTime)}</TableCell>
      <TableCell>{convertTimestamp(execution.endTime)}</TableCell>
      {parameters.map((p) => (
        <TableCell>{execution.trigger.parameters![p]}</TableCell>
      ))}
    </TableRow>
  );
};

export const PipelineExecutions = ({ executions, parameters, status }: IPipelineExecutionsProps) => {
  return (
    <Accordion elevation={3} disabled={executions.length === 0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">{status.text}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table>
            <TableHeaders headers={parameters} />
            <TableBody>
              {executions
                .filter((e) => status.values.includes(e.status))
                .map((e) => (
                  <ExecutionRow execution={e} parameters={parameters} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
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
