import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

import type { IExecution } from '@spinnaker/core';

interface IPipelineExecutionsProps {
  executions: IExecution[];
}

export const PipelineExecutions = ({ executions }: IPipelineExecutionsProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>In Progress</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
          lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};
