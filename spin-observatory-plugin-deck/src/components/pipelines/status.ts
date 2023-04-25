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
    values: ['FAILED_CONTINUE', 'TERMINAL'],
  },
};
