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
  return data;
};

const pauseExecution = (executionId: string) => REST('/pipelines').path(executionId).path('pause').put();

export const pauseExecutions = async (executionIds: string[]) => {
  return await Promise.all(executionIds.map((id) => pauseExecution(id)));
};

const resumeExecution = (executionId: string) => REST('/pipelines').path(executionId).path('resume').put();

export const resumeExecutions = async (executionIds: string[]) => {
  return await Promise.all(executionIds.map((id) => resumeExecution(id)));
};
