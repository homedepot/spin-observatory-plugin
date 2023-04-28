import {
  Application,
  ApplicationStateProvider,
  ApplicationDataSourceRegistry,
  IDeckPlugin,
  IPipeline,
  REST,
  DELIVERY_KEY,
} from '@spinnaker/core';

import { PluginContainer } from './components/PluginContainer';

export const plugin: IDeckPlugin = {
  initialize: () => {
    console.log("v0.5.0+12")
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
      activeState: '**.observatory.**',
      visible: true,
      sref: '.observatory',
      lazy: true,
      category: DELIVERY_KEY,
      defaultData: [],
      description: 'Example Data Source',
      iconName: 'artifact',
      loader: (application: Application) => REST('/applications').path(application.name).path('pipelineConfigs').get(),
      onLoad: (application: Application, data: IPipeline[]) => Promise.resolve(data),
    });
  },
};
