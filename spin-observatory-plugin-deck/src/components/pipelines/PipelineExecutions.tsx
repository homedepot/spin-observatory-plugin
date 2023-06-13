import React, { useEffect, useState } from 'react';
import { IExecution, IPipeline, useInterval } from '@spinnaker/core';
import { POLL_DELAY_MS, REQUEST_PAGE_SIZE } from './constants';
import { getExecutions } from '../../services/gateService';
import { ExecutionsTable } from './ExecutionsTable';
import { IDateRange } from '../date-picker/date-picker';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core';
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
  onStatusChange: ({ statusCount }: { statusCount: any }) => void
}

export const PipelineExecutions = ({ appName, pipeline, parameters, statuses, dateRange, onStatusChange }: IPipelineExecutionsProps) => {
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [statusCount, setStatusCount] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const styles = useStyles();

  useEffect(() => {
    if (!pipeline) {
      setExecutions([]);
      setStatusCount({});
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
      console.log("useEffect:pipeline");
      console.log(resp);

      setExecutions(resp);
      setStatusCount(getStatusCount(resp));
      setIsLoading(false);
    });
  }, [pipeline]);

  useEffect(() => {
    console.log("useEffect:statuscount");
    console.log(statusCount);

    onStatusChange(statusCount);
  }, [statusCount]);

  useEffect(() => {
    console.log("useEffect:statuses");
    console.log(executions);

    setExecutions(getFilteredExecutions(executions));
  }, [statuses]);

  useInterval(async () => {
    if (!pipeline) return;
    const resp = await getExecutions(appName, {
      pipelineName: pipeline.name,
      pageSize: REQUEST_PAGE_SIZE,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });

    setExecutions(getFilteredExecutions(resp));
    setStatusCount(getStatusCount(resp));
    setIsLoading(false);
  }, POLL_DELAY_MS);

  const getFilteredExecutions = (ex: IExecution[]) => {
    console.log("getFilteredExecutions");

    let selectedStatus = {} as any;

    const statusArr = statuses.length === 0 ? STATUSES : statuses;
    for (const s of statusArr) {
      selectedStatus[s] = true;
    }

    let filteredExecutions = [] as IExecution[];
    for (const e of ex) {
      if (e.status in selectedStatus) {
        filteredExecutions.push(e);
      }
    }

    return filteredExecutions;
  };

  const getStatusCount = (ex: IExecution[]) => {
    console.log("getStatusCount");

    let statusCount = {} as any;
    for (const e of ex) {
      if (!(e.status in statusCount)) {
        statusCount[e.status] = 0;
      }

      statusCount[e.status]++;
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

  return <ExecutionsTable executions={executions} parameters={parameters} />
};
