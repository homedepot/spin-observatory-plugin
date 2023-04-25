import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';

import type { Application, IExecution, IPipeline } from '@spinnaker/core';
import { ReactSelectInput, useDataSource } from '@spinnaker/core';

import { ParameterSelect } from './parameters';
import { PipelineExecutions, statuses } from './pipelines';
import { getExecutions } from '../services/gateService';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const dataSource = app.getDataSource('observatory');
  const { data: pipelines } = useDataSource<IPipeline[]>(dataSource);
  const [selectedPipeline, setSelectedPipeline] = useState<IPipeline>();

  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [executions, setExecutions] = useState<IExecution[]>([]);

  useEffect(() => {
    dataSource.activate();
  }, []);

  const onPipelineSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    const pipelineConfig = pipelines.find((p) => p.name === e.target.value);
    setSelectedPipeline(pipelineConfig);

    const resp = await getExecutions(app.name, { pipelineName: pipelineConfig!.name, pageSize: 100 });
    setExecutions(resp);
    console.log(executions)
  };

  return (
    <div className="flex-container-v" style={{ margin: '3rem', width: '100%' }}>
      <div className="flex-container-h" style={{ flexGrow: 1 }}>
        <div className="flex-pull-left" style={{ width: '20rem' }}>
          <ReactSelectInput
            onChange={onPipelineSelect}
            value={!selectedPipeline ? '' : selectedPipeline.name}
            placeholder="Select Pipeline..."
            searchable={true}
            clearable={true}
            options={pipelines.map((p) => ({ label: p.name, value: p.name }))}
          />
        </div>
        <div className="flex-pull-right" style={{ width: '40rem' }}>
          <ParameterSelect
            pipeline={selectedPipeline}
            selectedParams={selectedParams}
            setSelectedParams={setSelectedParams}
          />
        </div>
      </div>
      <div style={{ flexGrow: 19 }}>
        <PipelineExecutions executions={executions} parameters={selectedParams} status={statuses.SUCCESSFUL} />
      </div>
    </div>
  );
}
