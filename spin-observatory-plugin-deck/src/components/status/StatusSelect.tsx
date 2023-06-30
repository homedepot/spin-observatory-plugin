import React from 'react';
import type { Option } from 'react-select';
import Select from 'react-select';

import type { IPipeline } from '@spinnaker/core';

export const STATUSES = [
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
  'REDIRECT',
];

interface IStatusSelectProps {
  className?: string;
  pipeline?: IPipeline;
  selectedStatus: string[];
  setSelectedStatus(params: string[]): void;
  statusCount: Map<string, number>;
}

export const StatusSelect = ({
  className,
  pipeline,
  selectedStatus,
  setSelectedStatus,
  statusCount,
}: IStatusSelectProps) => {
  const onStatusSelect = (options: Array<Option<string>>) => {
    setSelectedStatus(options.map((o) => o.value));
  };

  const extractStatus = (statusCount: Map<string, number>): Array<Option<string>> => {
    const options: Array<Option<string>> = [];
    statusCount.forEach((value, key) => {
      options.push({ label: `${key} (${value})`, value: key });
    });

    return options;
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
      options={!pipeline ? [] : extractStatus(statusCount)}
      multi
    />
  );
};
