import React, { useEffect, useState } from 'react';

import { IStatus, POLL_DELAY_MS, REQUEST_PAGE_SIZE } from './constants';
import { IExecution, IPipeline, useInterval } from '@spinnaker/core';
import { getExecutions } from '../../services/gateService';
import { ExecutionsTable } from './ExecutionsTable';
import { IDateRange } from '../date-picker/date-picker';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  skeleton: { padding: '3rem', marginLeft: '2rem', marginRight: '2rem' },
});

interface IPipelineExecutionsProps {
  appName: string;
  pipelineName: string;
  parameters: string[];
  status: string[];
  dateRange: IDateRange;
}

export const PipelineExecutions = ({ appName, pipelineName, parameters, status, dateRange }: IPipelineExecutionsProps) => {
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const styles = useStyles();

  /*const getExecutionsParams = {
    pipelineName,
    pageSize: REQUEST_PAGE_SIZE,
    statuses: status.values,
  };*/

  const requestParams = {
    pipelineName: pipelineName,
    pageSize: REQUEST_PAGE_SIZE,
    // TODO: check if this is status or status.values()
    statuses: status.values(),
    startDate: dateRange.start,
    endDate: dateRange.end,
  };

  const refreshExecutions = () => {
    console.log('refreshing executions');
    getExecutions(appName, requestParams).then((resp) => setExecutions(resp));
  };

  useEffect(() => {
    if (!pipelineName) {
      setExecutions([]);
      setIsLoading(false);
      return;
    }

    const requestParams = {
      pipelineName: pipelineName,
      pageSize: REQUEST_PAGE_SIZE,
      statuses: status,
      startDate: dateRange.start,
      endDate: dateRange.end,
    };

    getExecutions(appName, requestParams).then((resp) => {
      setExecutions(resp);
      setIsLoading(false);
    });
  }, [pipelineName]);

  useInterval(async () => {
    if (!pipelineName) return;
    const resp = await getExecutions(appName, {
      pipelineName: pipelineName,
      // todo: statuses: status,
      pageSize: REQUEST_PAGE_SIZE,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });
    setExecutions(resp);
    setIsLoading(false);
  }, POLL_DELAY_MS);

  if (isLoading) {
    return (
      [...Array(3).keys()].map((key) => (
        <Skeleton key={key} animation="wave" variant="text" classes={{ root: styles.skeleton }} />
      ))
    );
  }

  if (executions.length == 0) {
    return <h4 style={{ textAlign: 'center' }}>No pipeline executions found.</h4>
  }

  return <ExecutionsTable
      executions={executions}
      parameters={parameters}
      status={status}
      refreshExecutions={refreshExecutions}
  />
};
