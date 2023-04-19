import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react';

export const DatePicker = () => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUIDatePicker />
    </LocalizationProvider>
    );
};

DatePicker.displayName = 'DatePicker';
