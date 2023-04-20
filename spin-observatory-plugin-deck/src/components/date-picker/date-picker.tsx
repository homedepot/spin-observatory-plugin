import React from 'react';
import TextField from '@material-ui/core/TextField';

export const DatePicker = () => {
  console.log('hello date picker');
  return (
    <TextField
      id="datetime-local"
      label="Next appointment"
      type="datetime-local"
      defaultValue="2017-05-24T10:30"
      InputLabelProps={{
        shrink: true,
      }}
    />
  )
};

DatePicker.displayName = 'DatePicker';
