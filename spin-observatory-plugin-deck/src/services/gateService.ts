import type { IExecution } from '@spinnaker/core';
import { REST } from '@spinnaker/core';

interface IExecutionsParams {
  pipelineName: string;
  pageSize: number;
}

export const getExecutions = async (appName: string, params: IExecutionsParams) => {
  const { pipelineName, pageSize } = params;
  return await REST('/applications')
    .path(appName)
    .path('/executions/search')
    .query({ pipelineName, size: pageSize })
    .get<IExecution[]>();
};
