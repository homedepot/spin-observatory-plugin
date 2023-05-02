import React, { useState, ReactNode } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  skeleton: { padding: '3rem', marginLeft: '2rem', marginRight: '2rem' },
  accordion: { marginBottom: '1rem' },
});

interface IExecutionContainerProps {
  loading: boolean;
  heading: string;
  children: NonNullable<ReactNode>;
}

export const ExecutionsContainer = ({ loading, heading, children }: IExecutionContainerProps) => {
  const [expanded, setExpanded] = useState(false);
  const styles = useStyles();

  const onAccordionClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion elevation={2} expanded={expanded} square classes={{ root: styles.accordion }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={onAccordionClick}>
        <Typography variant="h5">{heading}</Typography>
      </AccordionSummary>
      {loading ? (
        [...Array(4).keys()].map((key) => (
          <Skeleton key={key} animation="wave" variant="text" classes={{ root: styles.skeleton }} />
        ))
      ) : (
        <AccordionDetails>{children}</AccordionDetails>
      )}
    </Accordion>
  );
};
