import { Application, IPipeline, ReactSelectInput } from '@spinnaker/core';
import React, { useState, useEffect } from 'react';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const [pipelines, setPipelines] = useState<IPipeline[]>([]);
  const data = app.getDataSource('observatory').data as IPipeline[];

  useEffect(() => {
    setPipelines(data);
  }, data);

  console.log(pipelines);
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
