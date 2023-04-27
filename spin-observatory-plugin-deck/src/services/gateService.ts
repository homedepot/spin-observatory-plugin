import type { IExecution } from '@spinnaker/core';
import { REST } from '@spinnaker/core';

interface IExecutionsParams {
  pipelineName: string;
  pageSize: number;
  statuses: string[];
  firstItemIdx?: number;
}

export const getExecutions = async (appName: string, params: IExecutionsParams) => {
  const { pipelineName, pageSize, statuses, firstItemIdx = 0 } = params;
  const data = await REST('/applications')
    .path(appName)
    .path('executions')
    .path('search')
    .query({ pipelineName, size: pageSize, startIndex: firstItemIdx, statuses: statuses.join(',') })
    .get<IExecution[]>();
  console.log(params, data);
  return data;
};
