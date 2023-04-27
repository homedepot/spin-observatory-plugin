import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableRow,
  TablePagination,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { IExecution, IPipeline, useInterval } from '@spinnaker/core';
import { TableHeaders } from './TableHeaders';
import { ExecutionRow } from './ExecutionRow';
import { IStatus, STATUSES, POLL_DELAY_MS, DEFAULT_ROWS_PER_PAGE } from './constants';
import { getExecutions } from '../../services/gateService';
import { PaginationActions } from './PaginationActions';

interface IPipelineExecutionsProps {
  appName: string;
  pipeline?: IPipeline;
  parameters: string[];
  status: IStatus;
}

export const PipelineExecutions = ({ appName, pipeline, parameters, status }: IPipelineExecutionsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [selectedExecutions, setSelectedExecutions] = useState<string[]>([]);
  const [currentPage, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  useEffect(() => {
    if (!pipeline) {
      setExecutions([]);
      return;
    }
    getExecutions(appName, {
      pipelineName: pipeline.name,
      pageSize: rowsPerPage,
      statuses: status.values,
    }).then((resp) => setExecutions(resp));
  }, [pipeline, rowsPerPage]);

  useInterval(async () => {
    if (!pipeline) return;
    const resp = await getExecutions(appName, {
      pipelineName: pipeline.name,
      statuses: status.values,
      pageSize: rowsPerPage,
      firstItemIdx: rowsPerPage * currentPage,
    });
    setExecutions(resp);
  }, POLL_DELAY_MS);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRowsCount = currentPage > 0 ? Math.max(0, (1 + currentPage) * rowsPerPage - executions.length) : 0;

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

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
      expanded={executions.length === 0 ? false : expanded}
      square
      sx={{ marginBottom: '1rem' }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={onAccordionClick}>
        <Typography variant="h5">{status.text}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper} sx={{ borderRadius: 'inherit' }}>
          <Table stickyHeader>
            <TableHeaders
              headers={
                status === STATUSES.TRIGGERED
                  ? ['ID', 'Status', 'Start Time', ...parameters]
                  : ['ID', 'Status', 'Start Time', 'End Time', ...parameters]
              }
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
                  inProgress={status === STATUSES.TRIGGERED}
                  onSelectOne={handleSelectOne(e.id)}
                />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={-1}
                  onPageChange={handlePageChange}
                  page={currentPage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[DEFAULT_ROWS_PER_PAGE, 50, 100]}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  ActionsComponent={PaginationActions}
                  labelRowsPerPage="Executions per page"
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};
