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
import React, { ChangeEvent, MouseEventHandler, useState } from 'react';
import { IExecution, ReactInjector } from '@spinnaker/core';

interface IPipelineExecutionsProps {
  executions: IExecution[];
  parameters: string[];
  statusText: string;
}

interface ITableHeadersProps {
  headers: string[];
  onSelectAll: (e: ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  selectedCount: number;
}

interface IExecutionRowProps {
  execution: IExecution;
  parameters: string[];
  onSelectOne: MouseEventHandler<HTMLTableRowElement>;
  isSelected: boolean;
}

const TableHeaders = ({ headers, onSelectAll, rowCount, selectedCount }: ITableHeadersProps) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={selectedCount > 0 && selectedCount < rowCount}
            checked={rowCount > 0 && selectedCount === rowCount}
            onChange={onSelectAll}
          />
        </TableCell>
        {['ID', 'Status', 'Start Time', 'End Time', ...headers].map((h) => (
          <TableCell>
            <Typography variant="h6">{h}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const goToExecutionDetails = (executionId: string) => () => {
  const { $state, $uiRouter } = ReactInjector;
  const detailsState = $uiRouter.globals.current.name!.replace('observatory', 'pipelines.executions.execution');
  $state.go(detailsState, { executionId });
};

const ExecutionRow = ({ execution, parameters, onSelectOne, isSelected }: IExecutionRowProps) => {
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

export const PipelineExecutions = ({ executions, parameters, statusText }: IPipelineExecutionsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedExecutions, setSelectedExecutions] = useState<string[]>([]);

  const onAccordionClick = () => {
    executions.length === 0 ? setExpanded(false) : setExpanded(!expanded);
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedExecutions(executions.map((e) => e.id));
      return;
    }
    setSelectedExecutions([]);
  };

  const handleSelectOne = (executionId: string) => () => {
    const selectedIdx = selectedExecutions.indexOf(executionId);
    let newSelected: string[] = [];

    if (selectedIdx === -1) {
      newSelected = [...selectedExecutions, executionId];
    } else {
      newSelected = selectedExecutions.filter((e) => e !== executionId);
    }

    setSelectedExecutions(newSelected);
  };

  const isSelected = (name: string) => selectedExecutions.indexOf(name) !== -1;

  return (
    <Accordion
      elevation={2}
      disabled={executions.length === 0}
      expanded={expanded}
      square
      sx={{ marginBottom: '1rem' }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={onAccordionClick}>
        <Typography variant="h5">{statusText}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper} sx={{ borderRadius: 'inherit' }}>
          <Table>
            <TableHeaders
              headers={parameters}
              onSelectAll={handleSelectAll}
              rowCount={executions.length}
              selectedCount={selectedExecutions.length}
            />
            <TableBody>
              {executions.map((e) => (
                <ExecutionRow
                  key={e.id}
                  isSelected={isSelected(e.id)}
                  execution={e}
                  parameters={parameters}
                  onSelectOne={handleSelectOne(e.id)}
                />
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
