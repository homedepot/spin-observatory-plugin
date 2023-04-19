import { Application } from '@spinnaker/core';
import * as React from 'react';
import { DatePicker } from './DatePicker/DatePicker';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer(props: IPluginContainerProps) {
  return (
    <>
      <h1>Observatory</h1>
      <DatePicker />
    </>
  );
}
