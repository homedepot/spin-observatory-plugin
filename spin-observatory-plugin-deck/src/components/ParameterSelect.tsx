import { IPipeline } from '@spinnaker/core';
import React from 'react';
import type { Option } from 'react-select';
import Select from 'react-select';

import './parameterselect.less';

interface IParameterSelectProps {
  pipeline?: IPipeline;
  selectedParams: string[];
  setSelectedParams(params: string[]): void;
}

export const ParameterSelect = ({ pipeline, selectedParams, setSelectedParams }: IParameterSelectProps) => {
  const onParameterSelect = (options: Option<string>[]) => {
    setSelectedParams(options.map((o) => o.value));
  };

  return (
    <Select
      onChange={onParameterSelect}
      value={selectedParams}
      disabled={!pipeline}
      placeholder="Select Parameters..."
      clearable={true}
      noResultsText="No parameters"
      options={!pipeline || !pipeline.parameterConfig ? [] : extractPipelineParams(pipeline)}
      multi
    />
  );
};

const extractPipelineParams = (config: IPipeline): Option<string>[] => {
  return config.parameterConfig.map((p) => ({ label: p.name, value: p.name }));
};
