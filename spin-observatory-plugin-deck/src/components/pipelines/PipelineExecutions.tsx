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

interface IPipelineExecutionsProps {
  executions: IExecution[];
}

interface ITableHeadersProps {
  headers: string[];
}

const TableHeaders = ({ headers }: ITableHeadersProps) => {
  return (
    <TableHead>
      <TableRow>
        {headers.map((h) => (
          <TableCell>{h}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export const PipelineExecutions = ({ executions }: IPipelineExecutionsProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>In Progress</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table>
            <TableHeaders headers={[]} />
            <TableBody>
              {executions.map((e) => (
                <TableRow key={e.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {e.id}
                  </TableCell>
                  {Object.entries(e.trigger.parameters)}
                  <TableCell align="right">{e.trigger.parameters}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};
