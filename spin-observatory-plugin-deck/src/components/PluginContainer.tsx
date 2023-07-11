import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';

import type { Application, IPipeline } from '@spinnaker/core';
import { ReactSelectInput, useDataSource } from '@spinnaker/core';

import type { IDateRange } from './date-picker/date-picker';
import { DatePicker } from './date-picker/date-picker';
import { ParameterSelect } from './parameters';
import { MAX_DATE_RANGE, PipelineExecutions } from './pipelines';
import { StatusSelect } from './status';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  /* eslint-disable no-console */
  console.log('v0.14.0+6');
  const dataSource = app.getDataSource('observatory');
  const { data: pipelines } = useDataSource<IPipeline[]>(dataSource);
  const [selectedPipeline, setSelectedPipeline] = useState<IPipeline>();
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<IDateRange>({ start: 0, end: MAX_DATE_RANGE });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [statusCount, setStatusCount] = useState<Map<string, number>>(new Map<string, number>());

  useEffect(() => {
    dataSource.activate();
  }, []);

  const onPipelineSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    const pipelineConfig = pipelines.find((p) => p.name === e.target.value);
    setSelectedParams([]);
    setSelectedStatus([]);
    setStatusCount(new Map<string, number>());
    setSelectedPipeline(pipelineConfig);
  };

  const handleDateFilterChange = ({ start, end }: { start: number; end: number }) => {
    setSelectedDateRange({ start, end });
  };

  const handleStatusCountChange = (statusCount: Map<string, number>) => {
    setStatusCount(statusCount);
  };

  return (
    <div className="flex-container-v" style={{ margin: '3rem', width: '100%', rowGap: '2rem' }}>
      <div className="flex-container-h" style={{ flexGrow: 1 }}>
        <div className="flex-pull-left" style={{ width: '20rem' }}>
          <ReactSelectInput
            onChange={onPipelineSelect}
            value={!selectedPipeline ? '' : selectedPipeline.name}
            placeholder="Select Pipeline..."
            searchable={true}
            clearable={true}
            options={pipelines.map((p) => ({ label: p.name, value: p.name }))}
          />
        </div>
        <div className="flex-pull-right" style={{ width: '60rem' }}>
          <div className="horizontal right">
            <DatePicker onChange={handleDateFilterChange} disabled={!selectedPipeline} />
            <div className="flex-1" style={{ margin: '0 5px' }}>
              <ParameterSelect
                className="flex-1"
                pipeline={selectedPipeline}
                selectedParams={selectedParams}
                setSelectedParams={setSelectedParams}
              />
            </div>
            <StatusSelect
              className="flex-1"
              pipeline={selectedPipeline}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              statusCount={statusCount}
            />
          </div>
        </div>
      </div>
      <div style={{ flexGrow: 19 }}>
        {!selectedPipeline ? (
          <h4 style={{ textAlign: 'center' }}>Please select a pipeline to view executions.</h4>
        ) : (
          <PipelineExecutions
            onStatusChange={handleStatusCountChange}
            appName={app.name}
            pipeline={selectedPipeline}
            parameters={selectedParams}
            statuses={selectedStatus}
            dateRange={selectedDateRange}
          />
        )}
      </div>
    </div>
  );
}
