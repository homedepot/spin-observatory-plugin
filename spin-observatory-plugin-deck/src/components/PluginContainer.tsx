import { Application, ReactSelectInput } from '@spinnaker/core';
import * as React from 'react';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({app}: IPluginContainerProps) {
  console.log(app.getDataSource("observatory"))
  return <div className="flex-container-v">
    <div className="flex-container-h">
      <div className="flex-pull-left">
        <ReactSelectInput options={app.getDataSource("observatory").data}/>
      </div>
    </div>
  </div>;
}
