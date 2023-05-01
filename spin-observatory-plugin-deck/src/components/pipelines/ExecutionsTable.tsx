import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableRow,
  TablePagination,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { IExecution } from '@spinnaker/core';
import { TableHeaders } from './TableHeaders';
import { ExecutionRow } from './ExecutionRow';
import { IStatus, STATUSES, DEFAULT_ROWS_PER_PAGE } from './constants';
import { PaginationActions } from './PaginationActions';

interface IExecutionsTableProps {
  executions: IExecution[];
  parameters: string[];
  status: IStatus;
}

export const ExecutionsTable = ({ executions, parameters, status }: IExecutionsTableProps) => {
  const [selectedExecutions, setSelectedExecutions] = useState<string[]>([]);
  const [currentPage, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const headers =
    status === STATUSES.TRIGGERED
      ? ['ID', 'Status', 'Start Time', ...parameters]
      : ['ID', 'Status', 'Start Time', 'End Time', ...parameters];

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
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
              labelRowsPerPage={
                <div>
                  <Typography sx={{ fontSize: '1rem' }}>Executions per page</Typography>
                </div>
              }
              labelDisplayedRows={({ from, to, count }) => (
                <div>
                  <Typography>
                    {from}-{to} of {count}
                  </Typography>
                </div>
              )}
              ActionsComponent={PaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
