import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

export const ParameterSelect = () => {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}


// import { IPipeline } from '@spinnaker/core';
// import React from 'react';
// import type { Option } from 'react-select';
// import VirtualizedSelect from 'react-virtualized-select';

// import "./parameterselect.less"

// interface IParameterSelectProps {
//   pipeline?: IPipeline;
//   selectedParams: string[];
//   setSelectedParams(params: string[]): void;
// }

// export const ParameterSelect = ({ pipeline, selectedParams, setSelectedParams }: IParameterSelectProps) => {
//   const onParameterSelect = (options: Option<string>[]) => {
//     console.log(pipeline);
//     setSelectedParams(options.map((o) => o.value));
//   };

//   return (
//     <VirtualizedSelect
//       onChange={onParameterSelect}
//       value={selectedParams}
//       disabled={!pipeline}
//       placeholder="Select Parameters..."
//       clearable={true}
//       noResultsText="No parameters"
//       options={!pipeline || !pipeline.parameterConfig ? [] : extractPipelineParams(pipeline)}
//       multi
//     />
//   );
// };

// const extractPipelineParams = (config: IPipeline): Option<string>[] => {
//   return config.parameterConfig.map((p) => ({ label: p.name, value: p.name }));
// };
