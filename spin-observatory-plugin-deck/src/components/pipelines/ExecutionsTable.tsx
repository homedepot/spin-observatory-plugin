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
import { ActionButton, ActionButtonsContainer, RetriggerButton } from '../actions';
import { DEFAULT_ROWS_PER_PAGE } from './constants';
import { gate } from '../../services';
const useStyles = makeStyles({
  tableContainer: { borderRadius: 'inherit' },
  pagination: { fontSize: '1rem', margin: 'auto' },
});

interface IExecutionsTableProps {
  executions: IExecution[];
  parameters: string[];
  refreshExecutions: () => void;
}

export const ExecutionsTable = ({ executions, parameters, refreshExecutions }: IExecutionsTableProps) => {
  const [selectedExecutionIds, setSelectedExecutionIds] = useState<string[]>([]);
  const [currentPage, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const styles = useStyles();

  const headers = ['ID', 'Status', 'Start Time', 'End Time', ...parameters];

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedExecutionIds(executions.map((e) => e.id));
      return;
    }
    setSelectedExecutionIds([]);
  };

  const handleSelectOne = (executionId: string) => () => {
    const selectedIdx = selectedExecutionIds.indexOf(executionId);
    let newSelected: string[] = [];

    if (selectedIdx === -1) {
      newSelected = [...selectedExecutionIds, executionId];
    } else {
      newSelected = selectedExecutionIds.filter((e) => e !== executionId);
    }

    setSelectedExecutionIds(newSelected);
  };

  const isSelected = (name: string) => selectedExecutionIds.indexOf(name) !== -1;

  const pausable = executions.filter((e) => e.status === 'RUNNING' && selectedExecutionIds.includes(e.id)).length > 0;
  const handlePause = () => {
    gate.pauseExecutions(selectedExecutionIds).then(() => refreshExecutions());
  };

  const resumable = executions.filter((e) => e.status === 'PAUSED' && selectedExecutionIds.includes(e.id)).length > 0;
  const handleResume = () => {
    gate.resumeExecutions(selectedExecutionIds).then(() => refreshExecutions());
  };

  return (
    <TableContainer component={Paper} classes={{ root: styles.tableContainer }}>
      <Table stickyHeader>
        <TableHeaders
          headers={headers}
          onSelectAll={handleSelectAll}
          rowCount={executions.length}
          selectedCount={selectedExecutionIds.length}
        />
        <TableBody>
          {executions.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((e) => (
            <ExecutionRow
              key={e.id}
              isSelected={isSelected(e.id)}
              execution={e}
              parameters={parameters}
              onSelectOne={handleSelectOne(e.id)}
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <ActionButtonsContainer>
                <RetriggerButton
                  executions={executions.filter((e) => selectedExecutionIds.includes(e.id))}
                  refreshExecutions={refreshExecutions}
                />
                <ActionButton
                  title="Pause"
                  action={handlePause}
                  disabled={!pausable}
                  tooltip={pausable ? 'Pause selected executions' : 'No selected executions are running'}
                />
                <ActionButton
                  title="Resume"
                  action={handleResume}
                  disabled={!resumable}
                  tooltip={resumable ? 'Resume selected executions' : 'No selected executions are paused'}
                />
              </ActionButtonsContainer>
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
