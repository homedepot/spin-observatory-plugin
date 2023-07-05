import DateFnsUtils from '@date-io/date-fns';
import type { PopoverProps } from '@material-ui/core';
import { Button, ListSubheader, Menu, MenuItem, TextField } from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';

export interface IDateRange {
  start: number;
  end: number;
}

const START_AND_END_BY_HOURS = ({ hours = 1 }) => {
  const now = new Date();
  const minusHours = new Date(now.getTime() - hours * 60 * 60 * 1000);
  return { start: minusHours.getTime(), end: now.getTime() };
};

const PREMADE_SELECTIONS = [
  {
    value: 'hour',
    text: 'Last Hour',
    calculation: () => START_AND_END_BY_HOURS({ hours: 1 }),
  },
  {
    value: 'day',
    text: 'Last 24 Hours',
    calculation: () => START_AND_END_BY_HOURS({ hours: 24 }),
  },
  {
    value: 'week',
    text: 'Last 7 Days',
    calculation: () => START_AND_END_BY_HOURS({ hours: 24 * 7 }),
  },
  {
    value: 'month',
    text: 'Last 30 Days',
    calculation: () => START_AND_END_BY_HOURS({ hours: 24 * 30 }),
  },
];

type DatePickerProps = {
  disabled?: boolean;
  onChange: ({ start, end }: { start?: number; end?: number }) => void;
};

export const DatePicker = ({ disabled, onChange }: DatePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<PopoverProps['anchorEl'] | null>(null);
  const [value, setValue] = useState('');
  const [selectedCustomStart, setSelectedCustomStart] = useState(new Date());
  const [selectedCustomEnd, setSelectedCustomEnd] = useState(new Date());

  useEffect(() => {
    try {
      const start = selectedCustomStart.getTime();
      const end = selectedCustomEnd.getTime();
      // only emit if valid range
      if (start < end) {
        onChange({ end, start });
      }
    } catch (e) {
      /* eslint-disable no-console */
      console.error('invalid date: ', e);
    }
  }, [selectedCustomStart, selectedCustomEnd]);

  const handleClick = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (newValue: string) => {
    const item = PREMADE_SELECTIONS.find((i) => i.value === newValue);
    setValue(item.text);
    onChange(item.calculation());
    handleClose();
  };

  const handleStartDateChange = (date: Date) => {
    setSelectedCustomStart(date);
  };

  const handleEndDateChange = (date: Date) => {
    setSelectedCustomEnd(date);
  };

  const updateValueWithCustomDateRange = () => {
    setValue(`${selectedCustomStart.toLocaleDateString()} - ${selectedCustomEnd.toLocaleDateString()}`);
    handleClose();
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="flex-1">
        <TextField
          disabled={disabled}
          select
          fullWidth
          style={disabled ? {} : { backgroundColor: 'var(--color-white)' }}
          size="small"
          label="Filter Date Range"
          variant="outlined"
          value={value}
          onClick={handleClick}
          InputProps={{
            readOnly: true,
          }}
        >
          {PREMADE_SELECTIONS.map((option) => {
            return <MenuItem value={option.value}>{option.text}</MenuItem>;
          })}
          {PREMADE_SELECTIONS.findIndex((p) => p.value === value) === -1 && <MenuItem value={value}>{value}</MenuItem>}
        </TextField>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {PREMADE_SELECTIONS.map((option) => {
            return <MenuItem onClick={() => handleMenuItemClick(option.value)}>{option.text}</MenuItem>;
          })}
          <ListSubheader>Custom</ListSubheader>
          <MenuItem>
            <KeyboardDateTimePicker
              disableToolbar
              format="MM/dd/yyyy HH:mm"
              value={selectedCustomStart}
              onChange={handleStartDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change start date',
              }}
            />
            <KeyboardDateTimePicker
              disableToolbar
              format="MM/dd/yyyy HH:mm"
              value={selectedCustomEnd}
              onChange={handleEndDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change end date',
              }}
            />
            <Button onClick={updateValueWithCustomDateRange}>Apply</Button>
          </MenuItem>
        </Menu>
      </div>
    </MuiPickersUtilsProvider>
  );
};
