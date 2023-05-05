import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';

import type { IExecution } from '@spinnaker/core';

import { ExecutionRow } from './ExecutionRow';
import { PaginationActions } from './PaginationActions';
import { TableHeaders } from './TableHeaders';
import { PauseResumeButton, RetriggerButton } from '../actions';
import type { IStatus } from './constants';
import { DEFAULT_ROWS_PER_PAGE, STATUSES } from './constants';

const useStyles = makeStyles({
  tableContainer: { borderRadius: 'inherit' },
  pagination: { fontSize: '1rem', margin: 'auto' },
});

interface IExecutionsTableProps {
  executions: IExecution[];
  parameters: string[];
  status: IStatus;
  refreshExecutions: () => void;
}

export const ExecutionsTable = ({ executions, parameters, status, refreshExecutions }: IExecutionsTableProps) => {
  const [selectedExecutions, setSelectedExecutions] = useState<string[]>([]);
  const [currentPage, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const styles = useStyles();

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
    <TableContainer component={Paper} classes={{ root: styles.tableContainer }}>
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
            <TableCell colSpan={2}>
              {status === STATUSES.TRIGGERED && (
                <PauseResumeButton executionIds={selectedExecutions} refreshExecutions={refreshExecutions} />
              )}
              <RetriggerButton />
            </TableCell>
            <TablePagination
              classes={{ root: styles.pagination }}
              count={executions.length}
              onPageChange={handlePageChange}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[DEFAULT_ROWS_PER_PAGE, 20, 50]}
              onRowsPerPageChange={handleRowsPerPageChange}
              labelRowsPerPage={
                <div>
                  <Typography>Executions per page</Typography>
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
