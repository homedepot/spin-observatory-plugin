import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';

import type { Application, IPipeline } from '@spinnaker/core';
import { ReactSelectInput, useDataSource } from '@spinnaker/core';

import { DatePicker } from './date-picker/date-picker';
import { ParameterSelect } from './parameters';
import { PipelineExecutions, STATUSES } from './pipelines';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const dataSource = app.getDataSource('observatory');
  const { data: pipelines } = useDataSource<IPipeline[]>(dataSource);
  const [selectedPipeline, setSelectedPipeline] = useState<IPipeline>();
  const [selectedParams, setSelectedParams] = useState<string[]>([]);

  useEffect(() => {
    dataSource.activate();
  }, []);

  const onPipelineSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    const pipelineConfig = pipelines.find((p) => p.name === e.target.value);
    setSelectedParams([]);
    setSelectedPipeline(pipelineConfig);
  };

  const handleDateFilterChange = ({ start, end }: { start: number, end: number }) => {
    // eslint-disable-next-line no-console
    console.log("filter executions ", { start, end });
  };

  return (
    <div className="flex-container-v" style={{ margin: '3rem', width: '100%', rowGap: '2rem' }}>
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
          <DatePicker onChange={handleDateFilterChange} disabled={!selectedPipeline} />
          <ParameterSelect
            pipeline={selectedPipeline}
            selectedParams={selectedParams}
            setSelectedParams={setSelectedParams}
          />
        </div>
      </div>
      <div style={{ flexGrow: 19 }}>
        <PipelineExecutions
          appName={app.name}
          pipeline={selectedPipeline}
          parameters={selectedParams}
          status={STATUSES.SUCCESSFUL}
        />
        <PipelineExecutions
          appName={app.name}
          pipeline={selectedPipeline}
          parameters={selectedParams}
          status={STATUSES.FAILED}
        />
        <PipelineExecutions
          appName={app.name}
          pipeline={selectedPipeline}
          parameters={selectedParams}
          status={STATUSES.TRIGGERED}
        />
      </div>
    </div>
  );
}
