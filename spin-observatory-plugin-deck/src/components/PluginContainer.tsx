import { Application, IPipeline, ReactSelectInput } from '@spinnaker/core';
import * as React from 'react';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const dataSource = app.getDataSource('observatory');
  const pipelines = dataSource.data;

  console.log(pipelines);
  return (
    <div className="flex-container-v">
      <div className="flex-container-h">
        <div className="flex-pull-left">
          <ReactSelectInput optionsString={dataSource.loaded ? pipelines.map((p: IPipeline) => p.name) : []} />
        </div>
      </div>
    </div>
  );
}
