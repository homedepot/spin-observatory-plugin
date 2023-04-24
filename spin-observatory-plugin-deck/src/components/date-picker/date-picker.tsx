import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Menu,
  ListSubheader
} from "@material-ui/core";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const START_AND_END_BY_HOURS = ({ hours = 1 }) => {
  const now = new Date();
  const minusHours = new Date(now.getTime() - hours * 60 * 60 * 1000);
  return { start: minusHours.getTime(), end: now.getTime() };
};

const PREMADE_SELECTIONS = [
  {
    value: "hour",
    text: "Last Hour",
    calculation: () => START_AND_END_BY_HOURS({ hours: 1 })
  },
  {
    value: "day",
    text: "Last 24 Hours",
    calculation: () => START_AND_END_BY_HOURS({ hours: 24 })
  },
  {
    value: "week",
    text: "Last 7 Days",
    calculation: () => START_AND_END_BY_HOURS({ hours: 24 * 7 })
  },
  {
    value: "month",
    text: "Last 30 Days",
    calculation: () => START_AND_END_BY_HOURS({ hours: 24 * 30 })
  }
];

export const DatePicker = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCustomEnd, setSelectedCustomEnd] = useState(new Date());

  const handleClick = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (newValue: string) => {
    setValue(newValue);
    handleClose();
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // setValue(date.toLocaleDateString());
    // handleClose();
  };

  const handleEndDateChange = (date: Date) => {
    setSelectedCustomEnd(date);
  };

  const updateValueWithCustomDateRange = () => {
    setValue(
      `${selectedDate.toLocaleDateString()} - ${selectedCustomEnd.toLocaleDateString()}`
    );
    handleClose();
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <TextField
          select
          label="Select"
          value={value}
          onClick={handleClick}
          InputProps={{
            readOnly: true
          }}
        >
          {PREMADE_SELECTIONS.map((option) => {
            return <MenuItem value={option.value}>{option.text}</MenuItem>;
          })}
          {PREMADE_SELECTIONS.findIndex((p) => p.value === value) === -1 && (
            <MenuItem value={value}>{value}</MenuItem>
          )}
        </TextField>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {PREMADE_SELECTIONS.map((option) => {
            return (
              <MenuItem onClick={() => handleMenuItemClick(option.value)}>
                {option.text}
              </MenuItem>
            );
          })}
          <ListSubheader>Custom</ListSubheader>
          <MenuItem>
            <KeyboardDateTimePicker
              disableToolbar
              format="MM/dd/yyyy HH:mm"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change start date"
              }}
            />
            <KeyboardDateTimePicker
              disableToolbar
              format="MM/dd/yyyy HH:mm"
              value={selectedCustomEnd}
              onChange={handleEndDateChange}
              KeyboardButtonProps={{
                "aria-label": "change end date"
              }}
            />
            <Button onClick={updateValueWithCustomDateRange}>Apply</Button>
          </MenuItem>
        </Menu>
      </div>
    </MuiPickersUtilsProvider>
  );
}
