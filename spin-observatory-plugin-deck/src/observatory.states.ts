// import type { StateParams } from '@uirouter/angularjs';
// import { module } from 'angular';

// import { ProjectHeader } from '@spinnaker/core';
// import type { ApplicationStateProvider } from '@spinnaker/core';
// import { APPLICATION_STATE_PROVIDER } from '@spinnaker/core';
// import type { IProject } from '@spinnaker/core';
// import type { INestedState, StateConfigProvider } from '@spinnaker/core';
// import { STATE_CONFIG_PROVIDER } from '@spinnaker/core';
// import { ProjectReader } from '@spinnaker/core';
// import { ExampleView } from './components/ExampleView';

// export interface IProjectStateParms extends StateParams {
//   project: string;
// }

// export const OBSERVATORY_STATES_CONFIG = 'spin-observatory-plugin.observatory.state.config';

// export const initState = () => {
//   module(OBSERVATORY_STATES_CONFIG, [STATE_CONFIG_PROVIDER]).config([
//     'stateConfigProvider',
//     (stateConfigProvider: StateConfigProvider) => {

//       const observatory: INestedState = {
//         name: 'observatory',
//         url: '/observatory',
//         views: {
//           'main@': {
//             component: ExampleView,
//             $type: 'react',
//           },
//         },
//         data: {
//           pageTitleMain: {
//             label: 'Projects',
//           },
//         },
//       };

//       stateConfigProvider.addToRootState(observatory);
//       stateConfigProvider.addToRootState(project);
//       applicationStateProvider.addParentState(project, 'detail', '/applications');

//       stateConfigProvider.addRewriteRule('/projects/{project}', '/projects/{project}/dashboard');
//     },
//   ]);
// };
