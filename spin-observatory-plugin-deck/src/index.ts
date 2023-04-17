import type { IDeckPlugin } from '@spinnaker/core';
import { overridesComponent } from '@spinnaker/core';
import { overrideRegistrationQueue } from '@spinnaker/core';
import { SpinnakerHeader } from './components/header/SpinnakerHeader';

export const plugin: IDeckPlugin = {
  initialize: () => {
    overridesComponent(SpinnakerHeader, 'spinnakerHeader');
    overrideRegistrationQueue.register(SpinnakerHeader, 'spinnakerHeader');
  },
};
