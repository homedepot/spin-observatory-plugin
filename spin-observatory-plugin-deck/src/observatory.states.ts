import type { StateParams } from '@uirouter/angularjs';
import { module } from 'angular';

import { ProjectHeader } from '@spinnaker/core';
import type { ApplicationStateProvider } from '@spinnaker/core';
import { APPLICATION_STATE_PROVIDER } from '@spinnaker/core';
import type { IProject } from '@spinnaker/core';
import type { INestedState, StateConfigProvider } from '@spinnaker/core';
import { STATE_CONFIG_PROVIDER } from '@spinnaker/core';
import { ProjectReader } from '@spinnaker/core';
import { ExampleView } from './components/ExampleView';

export interface IProjectStateParms extends StateParams {
  project: string;
}

export const OBSERVATORY_STATES_CONFIG = 'spin-observatory-plugin.observatory.state.config';

export const initState = () => {
  module(OBSERVATORY_STATES_CONFIG, [APPLICATION_STATE_PROVIDER, STATE_CONFIG_PROVIDER]).config([
    'stateConfigProvider',
    'applicationStateProvider',
    (stateConfigProvider: StateConfigProvider, applicationStateProvider: ApplicationStateProvider) => {
      // const project: INestedState = {
      //   name: 'project',
      //   url: '/projects/{project}',
      //   resolve: {
      //     projectConfiguration: [
      //       '$stateParams',
      //       ($stateParams: IProjectStateParms) => {
      //         return ProjectReader.getProjectConfig($stateParams.project).then(
      //           (projectConfig: IProject) => projectConfig,
      //           (): IProject => {
      //             return {
      //               id: null,
      //               name: $stateParams.project,
      //               email: null,
      //               config: null,
      //               notFound: true,
      //             };
      //           },
      //         );
      //       },
      //     ],
      //   },
      //   views: {
      //     'main@': {
      //       component: ProjectHeader,
      //       $type: 'react',
      //     },
      //   },
      //   data: {
      //     pageTitleMain: {
      //       field: 'project',
      //     },
      //     history: {
      //       type: 'projects',
      //       state: 'home.project',
      //       keyParams: ['project'],
      //     },
      //   },
      //   children: [],
      // };

      const observatory: INestedState = {
        name: 'observatory',
        url: '/observatory',
        views: {
          'main@': {
            component: ExampleView,
            $type: 'react',
          },
        },
        data: {
          pageTitleMain: {
            label: 'Projects',
          },
        },
      };

      stateConfigProvider.addToRootState(observatory);
      // stateConfigProvider.addToRootState(project);
      // applicationStateProvider.addParentState(project, 'detail', '/applications');

      // stateConfigProvider.addRewriteRule('/projects/{project}', '/projects/{project}/dashboard');
    },
  ]);
};
