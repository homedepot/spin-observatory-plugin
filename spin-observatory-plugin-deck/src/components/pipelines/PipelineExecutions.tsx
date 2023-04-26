import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { IExecution } from '@spinnaker/core';
import { TableHeaders } from './TableHeaders';
import { ExecutionRow } from './ExecutionRow';

interface IPipelineExecutionsProps {
  executions: IExecution[];
  parameters: string[];
  statusText: string;
}

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
