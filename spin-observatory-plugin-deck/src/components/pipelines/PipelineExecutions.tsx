import React, { useEffect, useState } from 'react';
import { IExecution, IPipeline, useInterval } from '@spinnaker/core';
import { POLL_DELAY_MS, REQUEST_PAGE_SIZE } from './constants';
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
  pipeline?: IPipeline;
  parameters: string[];
  status: string[];
  dateRange: IDateRange;
  onStatusChange: ({ statusCount }: { statusCount: any }) => void
}

export const PipelineExecutions = ({ appName, pipeline, parameters, status, dateRange, onStatusChange }: IPipelineExecutionsProps) => {
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusCount, setStatusCount] = useState<any>({});
  const styles = useStyles();

  useEffect(() => {
    if (!pipeline) {
      setExecutions([]);
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
      let selectedStatus = {} as any;
      let map = {} as any;
      let execs = [] as IExecution[];

      for (const s of status) {
        selectedStatus[s] = true;
      }

      for (const execution of resp) {
        if (!(execution.status in map)) {
          map[execution.status] = 0;
        }

        map[execution.status]++;

        if (execution.status in selectedStatus) {
          execs.push(execution);
        }
      }

      setIsLoading(false);
      setExecutions(execs);
      setStatusCount(map);

      console.log("getExecutions");
      console.log(map);
    });
  }, [pipeline]);

  useEffect(() => {
    console.log("useEffect");
    console.log(statusCount);
    onStatusChange(statusCount);
  }, [statusCount]);

  useInterval(async () => {
    if (!pipeline) return;
    const resp = await getExecutions(appName, {
      pipelineName: pipeline.name,
      pageSize: REQUEST_PAGE_SIZE,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });

    let selectedStatus = {} as any;
    let map = {} as any;
    let execs = [] as IExecution[];

    for (const s of status) {
      selectedStatus[s] = true;
    }

    for (const execution of resp) {
      if (!(execution.status in map)) {
        map[execution.status] = 0;
      }

      map[execution.status]++;

      if (execution.status in selectedStatus) {
        execs.push(execution);
      }
    }
    
    setIsLoading(false);
    setExecutions(execs);
    setStatusCount(map);

    console.log("useInterval");
    console.log(map);
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

  return <ExecutionsTable executions={executions} parameters={parameters} />
};
