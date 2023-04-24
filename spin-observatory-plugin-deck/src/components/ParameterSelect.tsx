import { IPipeline, ReactSelectInput } from '@spinnaker/core';
import React, { ChangeEvent } from 'react';

interface IParameterSelectProps {
  pipeline?: IPipeline;
  selectedParams: string[];
  setSelectedParams(params: string[]): void;
}

export const ParameterSelect = ({ pipeline, selectedParams, setSelectedParams }: IParameterSelectProps) => {
  const onParameterSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(pipeline);
    console.log(e);
    console.log(e.target.selectedOptions);
  };

  return (
    <ReactSelectInput
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

const extractPipelineParams = (config: IPipeline) => {
  return config.parameterConfig.map((p) => ({ label: p.name, value: p.name }));
};
