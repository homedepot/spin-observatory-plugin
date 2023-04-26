import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';

import { Application, CollapsibleElement, CollapsibleSection, IExecution, IPipeline } from '@spinnaker/core';
import { ReactSelectInput, useDataSource, useInterval } from '@spinnaker/core';

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

  useInterval(async () => {
    if (!selectedPipeline) return;
    const resp = await getExecutions(app.name, { pipelineName: selectedPipeline.name, pageSize: 100 });
    setExecutions(resp);
  }, 10000);

  const onPipelineSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    const pipelineConfig = pipelines.find((p) => p.name === e.target.value);
    setSelectedParams([]);
    setSelectedPipeline(pipelineConfig);

    if (!pipelineConfig) {
      setExecutions([]);
      return;
    }
    const resp = await getExecutions(app.name, { pipelineName: pipelineConfig.name, pageSize: 100 });
    setExecutions(resp);
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
        <PipelineExecutions
          executions={executions.filter((e) => statuses.SUCCESSFUL.values.includes(e.status))}
          parameters={selectedParams}
          statusText={statuses.SUCCESSFUL.text}
        />
        <PipelineExecutions
          executions={executions.filter((e) => statuses.FAILED.values.includes(e.status))}
          parameters={selectedParams}
          statusText={statuses.FAILED.text}
        />
        <PipelineExecutions
          executions={executions.filter((e) => statuses.TRIGGERED.values.includes(e.status))}
          parameters={selectedParams}
          statusText={statuses.TRIGGERED.text}
        />
        <CollapsibleElement maxHeight={30}>
          <CollapsibleSection heading="test"></CollapsibleSection>
        </CollapsibleElement>
      </div>
    </div>
  );
}
