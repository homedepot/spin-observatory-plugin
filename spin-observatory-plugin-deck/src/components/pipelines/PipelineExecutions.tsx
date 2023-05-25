import React, { useEffect, useState } from 'react';
import { IExecution, IPipeline, useInterval } from '@spinnaker/core';
import { IStatus, IDateFilter, MAX_DATE_FILTER, POLL_DELAY_MS, REQUEST_PAGE_SIZE } from './constants';
import { getExecutions } from '../../services/gateService';
import { ExecutionsContainer } from './ExecutionsContainer';
import { ExecutionsTable } from './ExecutionsTable';

interface IPipelineExecutionsProps {
  appName: string;
  pipeline?: IPipeline;
  parameters: string[];
  status: IStatus;
  dateFilter: IDateFilter;
}

export const PipelineExecutions = ({ appName, pipeline, parameters, status, dateFilter }: IPipelineExecutionsProps) => {
  const [executions, setExecutions] = useState<IExecution[]>([]);

  useEffect(() => {
    if (!pipeline) {
      setExecutions([]);
      return;
    }

    if (!dateFilter) {
      dateFilter = { start: 0, end: MAX_DATE_FILTER }
    }

    const requestParams = {
      pipelineName: pipeline.name,
      pageSize: REQUEST_PAGE_SIZE,
      statuses: status.values,
      startDate: dateFilter.start,
      endDate: dateFilter.end,
    };

    getExecutions(appName, requestParams).then((resp) => setExecutions(resp));
  }, [pipeline]);

  useInterval(async () => {
    if (!pipeline) return;

    if (!dateFilter) {
      dateFilter = { start: 0, end: MAX_DATE_FILTER }
    }

    const resp = await getExecutions(appName, {
      pipelineName: pipeline.name,
      statuses: status.values,
      pageSize: REQUEST_PAGE_SIZE,
      startDate: dateFilter.start,
      endDate: dateFilter.end,
    });
    setExecutions(resp);
  }, POLL_DELAY_MS);

  return (
    <ExecutionsContainer loading={executions.length === 0} heading={status.text}>
      <ExecutionsTable executions={executions} parameters={parameters} status={status} />
    </ExecutionsContainer>
  );
};
