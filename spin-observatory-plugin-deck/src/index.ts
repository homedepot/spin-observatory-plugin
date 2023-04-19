import {
  Application,
  ApplicationStateProvider,
  ApplicationDataSourceRegistry,
  IDeckPlugin,
  REST,
} from '@spinnaker/core';

import { PluginContainer } from './components/PluginContainer';

export const plugin: IDeckPlugin = {
  initialize: () => {
    const injector = (window as any).spinnaker.$injector;
    const applicationState: ApplicationStateProvider = injector.get('applicationState');
    applicationState.addChildState({
      name: 'observatory',
      url: '/observatory',
      views: {
        insight: {
          component: PluginContainer,
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
