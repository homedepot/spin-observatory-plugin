import { IPipeline, ReactSelectInput } from '@spinnaker/core';
import React, { ChangeEvent } from 'react';

interface IParameterSelectProps {
  pipeline?: IPipeline;
  selectedParams: string[];
  setSelectedParams(params: string[]): void;
}

export const ParameterSelect = ({ pipeline, selectedParams, setSelectedParams }: IParameterSelectProps) => {
  const onParameterSelect = (e: ChangeEvent) => {
    const target = e.target as HTMLSelectElement;
    console.log(target);
  };

  return (
    <ReactSelectInput
      onChange={onParameterSelect}
      value={selectedParams}
      disabled={!pipeline}
      placeholder="Select Parameters..."
      clearable={true}
      options={!pipeline ? [] : extractPipelineParams(pipeline)}
      multi
    />
  );
};

const extractPipelineParams = (config: IPipeline) => {
  return config.parameterConfig.map((p) => ({ label: p.label, value: p.name }));
};
