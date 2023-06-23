export interface IStatus {
  text: string;
  values: string[];
}

export const STATUSES = [
  'SUCCEEDED',
  'FAILED_CONTINUE',
  'TERMINAL',
  'CANCELED',
  'NOT_STARTED',
  'RUNNING',
  'PAUSED',
  'SUSPENDED',
  'BUFFERED',
  'STOPPED',
  'SKIPPED',
  'REDIRECT'
];

export const TRIGGERED = [
  'NOT_STARTED',
  'RUNNING',
  'PAUSED',
  'SUSPENDED',
  'BUFFERED',
  'STOPPED',
  'SKIPPED'
]

export const REQUEST_PAGE_SIZE = 5000;

export const DEFAULT_ROWS_PER_PAGE = 10;

export const POLL_DELAY_MS = 10000;

export const MAX_DATE_RANGE = 9007199254740991;
