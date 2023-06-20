import React, { useEffect, useState } from 'react';

import { IExecution, IPipeline, useInterval } from '@spinnaker/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core';

import { POLL_DELAY_MS, REQUEST_PAGE_SIZE } from './constants';
import { getExecutions } from '../../services/gateService';
import { ExecutionsTable } from './ExecutionsTable';
import { IDateRange } from '../date-picker/date-picker';
import { STATUSES } from '../status';

const useStyles = makeStyles({
  skeleton: { padding: '3rem', marginLeft: '2rem', marginRight: '2rem' },
});

interface IPipelineExecutionsProps {
  appName: string;
  pipeline?: IPipeline;
  parameters: string[];
  statuses: string[];
  dateRange: IDateRange;
  onStatusChange: (statusCount: Map<string, number>) => void;
}

export const PipelineExecutions = ({ appName, pipeline, parameters, statuses, dateRange, onStatusChange }: IPipelineExecutionsProps) => {
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [filteredExecutions, setFilteredExecutions] = useState<IExecution[]>([]);
  const [statusCount, setStatusCount] = useState<Map<string, number>>(new Map<string, number>());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const styles = useStyles();

  useEffect(() => {
    if (!pipeline) {
      setExecutions([]);
      setFilteredExecutions([]);
      setStatusCount(new Map<string, number>());
      setIsLoading(false);
      return;
    }

    const requestParams = {
      pipelineName: pipeline.name,
      pageSize: REQUEST_PAGE_SIZE,
      startDate: dateRange.start,
      endDate: dateRange.end,
    };

    getExecutions(appName, requestParams).then((resp) => {
      setExecutions(resp);
      setFilteredExecutions(filterExecutions(resp));
      setStatusCount(getStatusCount(resp));
      setIsLoading(false);
    });
  }, [pipeline]);

  useEffect(() => {
    onStatusChange(statusCount);
  }, [statusCount]);

  useEffect(() => {
    setFilteredExecutions(filterExecutions(executions));
  }, [statuses]);

  useInterval(async () => {
    if (!pipeline) return;
    const resp = await getExecutions(appName, {
      pipelineName: pipeline.name,
      pageSize: REQUEST_PAGE_SIZE,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });

    setExecutions(resp);
    setFilteredExecutions(filterExecutions(resp));
    setStatusCount(getStatusCount(resp));
    setIsLoading(false);
  }, POLL_DELAY_MS);

  const filterExecutions = (ex: IExecution[]) => {
    const statusArr = statuses.length === 0 ? STATUSES : statuses;

    return ex.filter(e => statusArr.includes(e.status));
  };

  const getStatusCount = (ex: IExecution[]) => {
    let statusCount = new Map<string, number>();
    for (const e of ex) {
      if (!statusCount.has(e.status)) {
        statusCount.set(e.status, 1);
      } else {
        statusCount.set(e.status, statusCount.get(e.status) + 1);
      }
    }

    return statusCount;
  };

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

  return <ExecutionsTable executions={filteredExecutions} parameters={parameters} />
};
