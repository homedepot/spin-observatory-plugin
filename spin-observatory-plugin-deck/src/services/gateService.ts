import type { IExecution } from '@spinnaker/core';
import { REST } from '@spinnaker/core';

interface IExecutionsParams {
  pipelineName: string;
  pageSize: number;
  statuses: string[];
  firstItemIdx?: number;
  startDate?: number;
  endDate?: number;
}

export const getExecutions = async (appName: string, params: IExecutionsParams) => {
  const { pipelineName, pageSize, statuses, firstItemIdx = 0, startDate = 0, endDate = 9007199254740991 } = params;
  
  const data = await REST('/applications')
    .path(appName)
    .path('executions')
    .path('search')
    .query({ pipelineName, size: pageSize, startIndex: firstItemIdx, statuses: statuses.join(','), triggerTimeStartBoundary: startDate, triggerTimeEndBoundary: endDate })
    .get<IExecution[]>();
  return data;
};
