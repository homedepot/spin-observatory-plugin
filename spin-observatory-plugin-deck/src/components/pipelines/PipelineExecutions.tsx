import { makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import React, { useEffect, useState } from 'react';

import type { IExecution, IPipeline } from '@spinnaker/core';
import { useInterval } from '@spinnaker/core';

import { ExecutionsTable } from './ExecutionsTable';
import { POLL_DELAY_MS, REQUEST_PAGE_SIZE } from './constants';
import type { IDateRange } from '../date-picker/date-picker';
import { gate } from '../../services/';
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

export const PipelineExecutions = ({
  appName,
  pipeline,
  parameters,
  statuses,
  dateRange,
  onStatusChange,
}: IPipelineExecutionsProps) => {
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [filteredExecutions, setFilteredExecutions] = useState<IExecution[]>([]);
  const [statusCount, setStatusCount] = useState<Map<string, number>>(new Map<string, number>());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRequestInProgress, setIsRequestInProgress] = useState<boolean>(false);
  const styles = useStyles();

  const getExecutionsParams = {
    pipelineName: pipeline.name,
    pageSize: REQUEST_PAGE_SIZE,
    startDate: dateRange.start,
    endDate: dateRange.end,
  };

  const refreshExecutions = () => {
    gate.getExecutions(appName, getExecutionsParams).then((resp) => setExecutions(resp));
  };

  useEffect(() => {
    if (!pipeline.name) {
      setExecutions([]);
      setFilteredExecutions([]);
      setStatusCount(new Map<string, number>());
      setIsLoading(false);
      setIsRequestInProgress(false);
      return;
    }

    getExecutions(appName, getExecutionsParams);
  }, [pipeline, dateRange.start, dateRange.end]);

  useEffect(() => {
    onStatusChange(statusCount);
  }, [statusCount]);

  useEffect(() => {
    setFilteredExecutions(filterExecutions(executions));
  }, [statuses]);

  useInterval(async () => {
    if (!pipeline) return;

    getExecutions(appName, getExecutionsParams);
  }, POLL_DELAY_MS);

  const getExecutions = (name, params) => {
    setIsRequestInProgress(true);

    gate.getExecutions(name, params)
      .then((resp) => {
        setExecutions(resp);
        setFilteredExecutions(filterExecutions(resp));
        setStatusCount(getStatusCount(resp));
        setIsLoading(false);
      })
      .catch((e) => console.error('error retrieving executions: ', e))
      .finally(() => {
        setIsRequestInProgress(false);
      });
  };

  const filterExecutions = (ex: IExecution[]) => {
    const statusArr = statuses.length === 0 ? STATUSES : statuses;

    return ex.filter((e) => statusArr.includes(e.status));
  };

  const getStatusCount = (ex: IExecution[]) => {
    const statusCount = new Map<string, number>();
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
      <div>
        {[...Array(3).keys()].map((key) => (
          <Skeleton key={key} animation="wave" variant="text" classes={{ root: styles.skeleton }} />
        ))}
      </div>
    );
  }

  if (executions.length == 0) {
    return <h4 style={{ textAlign: 'center' }}>No pipeline executions found.</h4>;
  }

  return (
    <ExecutionsTable executions={filteredExecutions} parameters={parameters} refreshExecutions={refreshExecutions} />
  );
};
