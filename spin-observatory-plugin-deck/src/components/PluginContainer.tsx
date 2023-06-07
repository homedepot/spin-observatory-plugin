import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';

import type { Application, IPipeline } from '@spinnaker/core';
import { ReactSelectInput, useDataSource } from '@spinnaker/core';

import { DatePicker, IDateRange } from './date-picker/date-picker';
import { ParameterSelect } from './parameters';
import { PipelineExecutions, STATUSES, MAX_DATE_RANGE } from './pipelines';

interface IPluginContainerProps {
  app: Application;
}

export function PluginContainer({ app }: IPluginContainerProps) {
  const dataSource = app.getDataSource('observatory');
  const { data: pipelines } = useDataSource<IPipeline[]>(dataSource);
  const [selectedPipeline, setSelectedPipeline] = useState<IPipeline>();
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<IDateRange>({ start: 0, end: MAX_DATE_RANGE });
  const [selectedStatus, setSelectedStatus] = useState<string[]>(STATUSES);

  useEffect(() => {
    dataSource.activate();
  }, []);

  const onPipelineSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    const pipelineConfig = pipelines.find((p) => p.name === e.target.value);
    setSelectedParams([]);
    setSelectedPipeline(pipelineConfig);
  };

  const handleDateFilterChange = ({ start, end }: { start: number, end: number }) => {
    setSelectedDateRange({ start, end });
  };

  const pipelineExecutions = () => {
    if (!selectedPipeline) {
      return <h4 style={{ textAlign: 'center' }}>Select a pipeline..</h4>
    }

    return (
      <PipelineExecutions
        appName={app.name}
        pipeline={selectedPipeline}
        parameters={selectedParams}
        status={selectedStatus}
        dateRange={selectedDateRange}
      />
    )
  }

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
        <div className="flex-pull-right" style={{ width: '40rem' }}>
          <div className="horizontal middle right">
            <DatePicker onChange={handleDateFilterChange} disabled={!selectedPipeline} />
            <ParameterSelect
              className="flex-1"
              pipeline={selectedPipeline}
              selectedParams={selectedParams}
              setSelectedParams={setSelectedParams}
            />
          </div>
        </div>
      </div>
      <div style={{ flexGrow: 19 }}>
        {pipelineExecutions}
      </div>
    </div>
  );
}
