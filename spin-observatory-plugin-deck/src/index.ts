import type { IDeckPlugin } from '@spinnaker/core';
import { overrideRegistrationQueue } from '@spinnaker/core';
import { SpinnakerHeader } from './components/header/SpinnakerHeader';

export const plugin: IDeckPlugin = {
  initialize: () => {
    overrideRegistrationQueue.register(SpinnakerHeader, 'spinnakerHeader');
  },
};
