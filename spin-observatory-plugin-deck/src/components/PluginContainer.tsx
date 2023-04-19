import { Application, IPipeline, ReactSelectInput, useDataSource } from '@spinnaker/core';
import React, { useEffect, useState, ChangeEvent } from 'react';

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
    if (target.value) setSelectedPipeline(target.value);
  };

  return (
    <div className="flex-container-v">
      <div className="flex-container-h">
        <div className="flex-pull-left" style={{ width: '15rem' }}>
          <ReactSelectInput
            onChange={onPipelineSelect}
            value={selectedPipeline}
            options={pipelines.map((p) => ({ label: p.name, value: p.name }))}
          />
        </div>
      </div>
    </div>
  );
}
