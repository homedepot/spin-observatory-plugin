import {
  Application,
  ApplicationStateProvider,
  ApplicationDataSourceRegistry,
  IDeckPlugin,
  IPipeline,
  REST,
  navigationCategoryRegistry
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
      activeState: '**.observatory.**',
      visible: true,
      sref: '.observatory',
      lazy: true,
      defaultData: [],
      description: 'Example Data Source',
      iconName: 'artifact',
      category: "",
      loader: (application: Application) => REST('/applications').path(application.name).path('pipelineConfigs').get(),
      onLoad: (application: Application, data: IPipeline[]) => Promise.resolve(data),
    });
    console.log(navigationCategoryRegistry.getAll());
    navigationCategoryRegistry.register({
      key: "observatory",
      label: 'Observatory',
      iconName: 'artifact',
      primary: true,
      order: 150
    })
    console.log(navigationCategoryRegistry.getAll());
  },
};
