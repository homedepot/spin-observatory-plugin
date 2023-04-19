import { Application, IPipeline, ReactSelectInput, useDataSource } from '@spinnaker/core';
import React, { useEffect } from 'react';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const dataSource = app.getDataSource('observatory');
  const { data: pipelines, status, loaded } = useDataSource<IPipeline[]>(dataSource);

  useEffect(() => {
    dataSource.activate();
  }, []);

  console.log(pipelines, status, loaded);
  return (
    <div className="flex-container-v">
      <div className="flex-container-h">
        <div className="flex-pull-left">
          <ReactSelectInput options={pipelines.map((p) => ({ label: p.name, value: p.name }))} />
        </div>
      </div>
    </div>
  );
}
