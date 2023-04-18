import type { Application, ApplicationStateProvider, IDeckPlugin } from '@spinnaker/core';
import { ApplicationDataSourceRegistry, REST } from '@spinnaker/core';
import { overrideRegistrationQueue, SETTINGS } from '@spinnaker/core';

import { ExampleView } from './components/ExampleView';
import { SpinnakerHeader } from './components/header/SpinnakerHeader';

export const plugin: IDeckPlugin = {
  initialize: () => {
    overrideRegistrationQueue.register(SpinnakerHeader, 'SpinnakerHeader');
    const injector = (window as any).spinnaker.$injector;
    const applicationState: ApplicationStateProvider = injector.get('applicationState');
    applicationState.addChildState({
      name: 'observatory',
      url: '/observatory',
      views: {
        insight: {
          component: ExampleView,
          $type: 'react',
        },
      },
    });

    ApplicationDataSourceRegistry.registerDataSource({
      key: 'observatory',
      label: 'Observatory',
      autoActivate: true,
      activeState: '**.observatory.**',
      visible: true,
      sref: '.observatory',
      defaultData: [],
      description: 'Example Data Source',
      iconName: 'artifact',
      loader: (application: Application) => REST('/applications').path(application.name).path('pipelineConfigs').get(),
      onLoad: (application: Application, data: any) => Promise.resolve(data),
    });
  },
};
