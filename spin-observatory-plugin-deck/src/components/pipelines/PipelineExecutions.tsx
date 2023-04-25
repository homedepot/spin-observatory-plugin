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
        {['ID', ...headers].map((h) => (
          <TableCell>{h}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const ExecutionRow = ({ execution, parameters }: IExecutionRowProps) => {
  return (
    <TableRow key={execution.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {execution.id}
      </TableCell>
      {parameters.map((p) => (
        <TableCell align="right">{execution.trigger.parameters![p]}</TableCell>
      ))}
    </TableRow>
  );
};

export const PipelineExecutions = ({ executions, parameters, status }: IPipelineExecutionsProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{status.text}</Typography>
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
