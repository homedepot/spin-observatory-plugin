import type { IExecution } from '@spinnaker/core';
import { SETTINGS } from '@spinnaker/core';

const BROADSIDE_URI = `${SETTINGS.gateUrl}/proxies/broadside/v1/broadsides`;

// See https://github.com/one-thd/broadside/blob/main/api/swagger.yml#L206
const retriggerExecutions = ({ executions }: { executions: IExecution[] }) => {
  /***
   *       application: "clipper"
   *       pipelineNameOrId: "Generate Clipper X.509 Key Pair"
   *       amount: 50
   *       delay: 100
   *       pipelineBaseParameters: '{ "parameterName": "custom data" }'
   *       pipelineMultiParameters: '[ { "multiParameterName": "custom data" } ]'
   */

  let executionID;

  try {
    const parent = executions[0].trigger.parentExecution;
    if (parent && parent.id) {
      executionID = parent.id;
    } else {
      executionID = executions[0].trigger.parameters['parentExecutionId'];
    }
  } catch (e) {
    /* eslint-disable no-console */
    console.error(e);
    executionID = executions[0].id;
  }

  const broadsideRequest = JSON.stringify({
    application: executions[0].application,
    pipelineNameOrId: executions[0].name,
    amount: executions.length,
    pipelineMultiParameters: executions.map((e) => e.trigger.parameters),
    executionID,
  });
  /* eslint-disable no-console */
  console.log(broadsideRequest);

  return fetch(BROADSIDE_URI, {
    method: 'POST',
    credentials: 'include',
    body: broadsideRequest,
  });
};

export const broadside = { retriggerExecutions };
