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
  Skeleton,
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

  const headers =
    status === STATUSES.TRIGGERED
      ? ['ID', 'Status', 'Start Time', ...parameters]
      : ['ID', 'Status', 'Start Time', 'End Time', ...parameters];

  useEffect(() => {
    if (!pipeline) {
      setExecutions([]);
      return;
    }

    const requestParams = {
      pipelineName: pipeline.name,
      pageSize: 5000,
      statuses: status.values,
    };

    getExecutions(appName, requestParams).then((resp) => setExecutions(resp));
  }, [pipeline]);

  useInterval(async () => {
    if (!pipeline) return;
    const resp = await getExecutions(appName, {
      pipelineName: pipeline.name,
      statuses: status.values,
      pageSize: 5000,
    });
    setExecutions(resp);
  }, POLL_DELAY_MS);

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRowsCount = currentPage > 0 ? Math.max(0, (1 + currentPage) * rowsPerPage - executions.length) : 0;

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const onAccordionClick = () => {
    setExpanded(!expanded);
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
    <Accordion elevation={2} expanded={expanded} square sx={{ marginBottom: '1rem' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={onAccordionClick}>
        <Typography variant="h5">{status.text}</Typography>
      </AccordionSummary>
      {executions.length === 0 ? (
        [...Array(4).keys()].map((key) => (
          <Skeleton
            key={key}
            animation="wave"
            variant="text"
            sx={{ padding: '3rem', marginLeft: '2rem', marginRight: '2rem' }}
          />
        ))
      ) : (
        <AccordionDetails>
          <TableContainer component={Paper} sx={{ borderRadius: 'inherit' }}>
            <Table stickyHeader>
              <TableHeaders
                headers={headers}
                onSelectAll={handleSelectAll}
                rowCount={executions.length}
                selectedCount={selectedExecutions.length}
              />
              <TableBody>
                {executions.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((e) => (
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
                    count={executions.length}
                    onPageChange={handlePageChange}
                    page={currentPage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[DEFAULT_ROWS_PER_PAGE, 20, 50]}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    labelRowsPerPage="Executions per page"
                    ActionsComponent={PaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </AccordionDetails>
      )}
    </Accordion>
  );
};
