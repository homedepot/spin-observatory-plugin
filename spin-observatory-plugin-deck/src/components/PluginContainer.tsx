import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';

import type { Application, IPipeline } from '@spinnaker/core';
import type { IExecution } from '@spinnaker/core';
import { ReactSelectInput, useDataSource } from '@spinnaker/core';

import { PipelineExecutions } from './pipelines';
import { getExecutions } from '../services/gateService';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const dataSource = app.getDataSource('observatory');
  const { data: pipelines } = useDataSource<IPipeline[]>(dataSource);
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [executions, setExecutions] = useState<IExecution[]>([]);

  useEffect(() => {
    dataSource.activate();
  }, []);

  const onPipelineSelect = async (e: ChangeEvent) => {
    const target = e.target as HTMLSelectElement;
    if (!target.value) return;
    setSelectedPipeline(target.value);

    const res = await getExecutions(app.name, { pipelineName: selectedPipeline, pageSize: 100 });
    setExecutions(res);
    console.log(res); //eslint-disable-line
  };

  return (
    <div className="flex-container-v" style={{ margin: '3rem', width: '100%' }}>
      <div className="flex-container-h" style={{ flexGrow: 1 }}>
        <div className="flex-pull-left" style={{ width: '20rem' }}>
          <ReactSelectInput
            onChange={onPipelineSelect}
            value={selectedPipeline}
            placeholder="Select Pipeline..."
            searchable={true}
            clearable={true}
            options={pipelines.map((p) => ({ label: p.name, value: p.name }))}
          />
        </div>
      </div>
      <div style={{ flexGrow: 19 }}>
        <PipelineExecutions executions={executions} />
      </div>
    </div>
  );
}
