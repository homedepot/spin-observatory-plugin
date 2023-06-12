import React from 'react';
import type { Option } from 'react-select';
import Select from 'react-select';

import type { IPipeline } from '@spinnaker/core';
import { STATUSES } from '../pipelines';

interface IStatusSelectProps {
  pipeline?: IPipeline;
  selectedStatus: string[];
  setSelectedStatus(params: string[]): void;
}

export const StatusSelect = ({pipeline, selectedStatus, setSelectedStatus }: IStatusSelectProps) => {
  const onStatusSelect = (options: Array<Option<string>>) => {
    console.log(options.map((o) => o.value));
    setSelectedStatus(options.map((o) => o.value));
  };

  return (
    <Select
        onChange={onStatusSelect}
        value={selectedStatus}
        disabled={!pipeline}
        placeholder="Select Status..."
        clearable={true}
        noResultsText="No status"
        options={!pipeline ? [] : extractStatus(STATUSES)}
        multi
    />
  );
};

const extractStatus = (status: string[]): Array<Option<string>> => {
    return status.map((s) => ({ label: s, value: s}));
};
