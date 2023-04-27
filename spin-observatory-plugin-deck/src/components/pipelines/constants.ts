export interface IStatus {
  text: string;
  values: string[];
}

export const STATUSES = {
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

export const DEFAULT_ROWS_PER_PAGE = 10;

export const POLL_DELAY_MS = 10000;
