import type { IExecution } from '@spinnaker/core';
import { REST } from '@spinnaker/core';

interface IExecutionsParams {
  pipelineName: string;
  pageSize: number;
  startDate: number;
  endDate: number;
  firstItemIdx?: number;
}

const getExecutions = async (appName: string, params: IExecutionsParams) => {
  const { pipelineName, pageSize, startDate, endDate, firstItemIdx = 0 } = params;

  const data = await REST('/applications')
    .path(appName)
    .path('executions')
    .path('search')
    .query({
      pipelineName,
      size: pageSize,
      startIndex: firstItemIdx,
      triggerTimeStartBoundary: startDate,
      triggerTimeEndBoundary: endDate,
    })
    .get<IExecution[]>();
  return data;
};

const pauseExecution = (executionId: string) => REST('/pipelines').path(executionId).path('pause').put();

const pauseExecutions = async (executionIds: string[]) => {
  return await Promise.all(executionIds.map((id) => pauseExecution(id)));
};

const resumeExecution = (executionId: string) => REST('/pipelines').path(executionId).path('resume').put();

const resumeExecutions = async (executionIds: string[]) => {
  return await Promise.all(executionIds.map((id) => resumeExecution(id)));
};

const cancelExecution = (executionId: string) =>
  REST('/pipelines')
    .path(executionId)
    .path('cancel')
    .query({ reason: 'cancelled by spin-observatory-plugin', force: true })
    .put();

const cancelExecutions = async (executionIds: string[]) =>
  await Promise.all(executionIds.map((id) => cancelExecution(id)));

export const gate = { getExecutions, pauseExecutions, resumeExecutions, cancelExecutions };
