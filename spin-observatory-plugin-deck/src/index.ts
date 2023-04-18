import type { Application, ApplicationStateProvider, IDeckPlugin } from '@spinnaker/core';
import { ApplicationDataSourceRegistry, REST } from '@spinnaker/core';
import { overrideRegistrationQueue } from '@spinnaker/core';

import { ExampleView } from './components/ExampleView';
import { SpinnakerHeader } from './components/header/SpinnakerHeader';

export const plugin: IDeckPlugin = {
  initialize: () => {
    overrideRegistrationQueue.register(SpinnakerHeader, 'SpinnakerHeader');

    const injector = (window as any).spinnaker.$injector;
    const applicationState: ApplicationStateProvider = injector.get('applicationState');
    applicationState.addChildState({
      name: 'example',
      url: '/example',
      views: {
        insight: {
          component: ExampleView,
          $type: 'react',
        },
      },
    });

    ApplicationDataSourceRegistry.registerDataSource({
      key: 'example',
      label: 'Example',
      autoActivate: true,
      activeState: '**.example.**',
      visible: true,
      sref: '.example',
      defaultData: [],
      description: 'Example Data Source',
      iconName: 'artifact',
      loader: (application: Application) => REST('/example/data').get(),
      onLoad: (application: Application, data: any) => Promise.resolve(data),
    });
  },
};
