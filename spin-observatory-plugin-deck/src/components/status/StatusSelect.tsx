import React from 'react';
import type { Option } from 'react-select';
import Select from 'react-select';

import type { IPipeline } from '@spinnaker/core';

const STATUSES = [
    'SUCCEEDED',
    'FAILED_CONTINUE',
    'TERMINAL',
    'CANCELED',
    'NOT_STARTED',
    'RUNNING',
    'PAUSED',
    'SUSPENDED',
    'BUFFERED',
    'STOPPED',
    'SKIPPED',
    'REDIRECT'
];

interface IStatusSelectProps {
  className?: string;
  pipeline?: IPipeline;
  selectedStatus: string[];
  setSelectedStatus(params: string[]): void;
}

export const StatusSelect = ({className, pipeline, selectedStatus, setSelectedStatus }: IStatusSelectProps) => {
  const onStatusSelect = (options: Array<Option<string>>) => {
    setSelectedStatus(options.map((o) => o.value));
  };

  return (
    <Select
      className={className}
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
