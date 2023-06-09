import { TableCell, TableHead, TableRow, Typography, Checkbox } from '@material-ui/core';
import React, { ChangeEvent } from 'react';

interface ITableHeadersProps {
  headers: string[];
  onSelectAll: (e: ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  selectedCount: number;
}

export const TableHeaders = ({ headers, onSelectAll, rowCount, selectedCount }: ITableHeadersProps) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            style={rowCount > 0 && selectedCount === rowCount ? { color: 'var(--color-primary-g1)' } : {}}
            indeterminate={selectedCount > 0 && selectedCount < rowCount}
            checked={rowCount > 0 && selectedCount === rowCount}
            onChange={onSelectAll}
          />
        </TableCell>
        {headers.map((h) => (
          <TableCell>
            <Typography variant="h6">{h}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
