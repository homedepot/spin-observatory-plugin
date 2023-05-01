import React, { useState, ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, Typography, Skeleton, AccordionDetails } from '@mui/material';

interface IExecutionContainerProps {
  loading: boolean;
  heading: string;
  children: NonNullable<ReactNode>;
}

export const ExecutionsContainer = ({ loading, heading, children }: IExecutionContainerProps) => {
  const [expanded, setExpanded] = useState(false);

  const onAccordionClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion elevation={2} expanded={expanded} square sx={{ marginBottom: '1rem' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={onAccordionClick}>
        <Typography variant="h5">{heading}</Typography>
      </AccordionSummary>
      {loading ? (
        [...Array(4).keys()].map((key) => (
          <Skeleton
            key={key}
            animation="wave"
            variant="text"
            sx={{ padding: '3rem', marginLeft: '2rem', marginRight: '2rem' }}
          />
        ))
      ) : (
        <AccordionDetails>{children}</AccordionDetails>
      )}
    </Accordion>
  );
};
