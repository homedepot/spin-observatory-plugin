import type { IDeckPlugin } from '@spinnaker/core';
import { overrideRegistrationQueue } from '@spinnaker/core';
import { HeaderOverride } from './components/header/HeaderOverride';

export const plugin: IDeckPlugin = {
  initialize: () => {
    overrideRegistrationQueue.register(HeaderOverride, 'spinnakerHeader');
  },
};
