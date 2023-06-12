import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';

import type { Application, IPipeline } from '@spinnaker/core';
import { ReactSelectInput, useDataSource } from '@spinnaker/core';

import { DatePicker, IDateRange } from './date-picker/date-picker';
import { ParameterSelect } from './parameters';
import { PipelineExecutions, MAX_DATE_RANGE } from './pipelines';
import { StatusSelect } from './status';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const dataSource = app.getDataSource('observatory');
  const { data: pipelines } = useDataSource<IPipeline[]>(dataSource);
  const [selectedPipeline, setSelectedPipeline] = useState<IPipeline>();
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<IDateRange>({ start: 0, end: MAX_DATE_RANGE });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    dataSource.activate();
  }, []);

  const onPipelineSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    const pipelineConfig = pipelines.find((p) => p.name === e.target.value);
    setSelectedParams([]);
    setSelectedStatus([]);
    setSelectedPipeline(pipelineConfig);
  };

  const handleDateFilterChange = ({ start, end }: { start: number, end: number }) => {
    setSelectedDateRange({ start, end });
  };

  const handleStatusCountChange = ({ statusCount }: { statusCount: any }) => {
    console.log(statusCount)
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
          <div className="horizontal middle right">
            <DatePicker onChange={handleDateFilterChange} disabled={!selectedPipeline} />
            <ParameterSelect
              className="flex-1"
              pipeline={selectedPipeline}
              selectedParams={selectedParams}
              setSelectedParams={setSelectedParams}
            />
            <StatusSelect
              className="flex-1"
              pipeline={selectedPipeline}
              selectedStatus={selectedStatus}  
              setSelectedStatus={setSelectedStatus}
            />
          </div>
        </div>
      </div>
      <div style={{ flexGrow: 19 }}>
        {!selectedPipeline ? (
          <h4 style={{ textAlign: 'center' }}>Please select a pipeline to view executions.</h4>
        ) : (
          <PipelineExecutions
            appName={app.name}
            pipeline={selectedPipeline}
            parameters={selectedParams}
            status={selectedStatus}
            dateRange={selectedDateRange}
            onStatusChange={handleStatusCountChange}
          />
        )}
      </div>
    </div>
  );
}
