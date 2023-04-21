import { Application, IPipeline, ReactSelectInput, useDataSource } from '@spinnaker/core';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { DatePicker } from './date-picker/date-picker';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const dataSource = app.getDataSource('observatory');
  const { data: pipelines } = useDataSource<IPipeline[]>(dataSource);
  const [selectedPipeline, setSelectedPipeline] = useState<string>();

  useEffect(() => {
    dataSource.activate();
  }, []);

  const onPipelineSelect = (e: ChangeEvent) => {
    const target = e.target as HTMLSelectElement;
    setSelectedPipeline(target.value);
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
        <div className="flex-pull-right">
          <DatePicker />
        </div>
      </div>
      <div style={{ flexGrow: 19 }}>
        <h1>Pipeline Executions Here Test</h1>
      </div>
    </div>
  );
}
