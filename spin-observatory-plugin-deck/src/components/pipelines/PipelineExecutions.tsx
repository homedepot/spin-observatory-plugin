import React, { useEffect, useState } from 'react';
import { IExecution, useInterval } from '@spinnaker/core';
import { IStatus, POLL_DELAY_MS, REQUEST_PAGE_SIZE } from './constants';
import { getExecutions } from '../../services/gateService';
import { ExecutionsContainer } from './ExecutionsContainer';
import { ExecutionsTable } from './ExecutionsTable';

interface IPipelineExecutionsProps {
  appName: string;
  pipelineName: string;
  parameters: string[];
  status: IStatus;
}

export const PipelineExecutions = ({ appName, pipelineName, parameters, status }: IPipelineExecutionsProps) => {
  const [executions, setExecutions] = useState<IExecution[]>([]);

  const requestParams = {
    pipelineName,
    pageSize: REQUEST_PAGE_SIZE,
    statuses: status.values,
  };

  const refreshExecutions = () => {
    console.log("refreshing executions")
    getExecutions(appName, requestParams).then((resp) => setExecutions(resp));
  };

  useEffect(() => {
    if (!pipelineName) {
      setExecutions([]);
      return;
    }

    refreshExecutions();
  }, [pipelineName]);

  useInterval(() => {
    if (!pipelineName) return;
    refreshExecutions();
  }, POLL_DELAY_MS);

  return (
    <ExecutionsContainer loading={executions.length === 0} heading={status.text}>
      <ExecutionsTable
        executions={executions}
        parameters={parameters}
        status={status}
        refreshExecutions={refreshExecutions}
      />
    </ExecutionsContainer>
  );
};
