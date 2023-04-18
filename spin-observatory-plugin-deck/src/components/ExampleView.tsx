import { Application } from '@spinnaker/core';
import * as React from 'react';

interface IExampleViewProps {
  app: Application;
}

export function ExampleView(props: IExampleViewProps) {
  console.log(props.app.getDataSource('observatory').data);
  return <h1>Example View</h1>;
}
