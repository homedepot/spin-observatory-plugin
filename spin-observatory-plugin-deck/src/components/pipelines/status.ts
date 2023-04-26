export interface IStatus {
  text: string;
  values: string[];
}

export const statuses = {
  SUCCESSFUL: {
    text: 'Successful',
    values: ['SUCCEEDED'],
  },
  FAILED: {
    text: 'Failed',
    values: ['FAILED_CONTINUE', 'TERMINAL', 'CANCELED'],
  },
  TRIGGERED: {
    text: 'Triggered',
    values: ['NOT_STARTED', 'RUNNING', 'PAUSED', 'SUSPENDED', 'BUFFERED', 'STOPPED', 'SKIPPED'],
  },
};
