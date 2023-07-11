import type { IExecution } from '@spinnaker/core';
import { SETTINGS } from '@spinnaker/core';

const BROADSIDE_URI = `${SETTINGS.gateUrl}/proxies/broadside/v1/broadsides`;

// See https://github.com/one-thd/broadside/blob/main/api/swagger.yml#L206
const retriggerExecutions = ({ executions }: { executions: IExecution[] }) => {
  /***
   *       application:             "clipper"
   *       pipelineNameOrId:        "Generate Clipper X.509 Key Pair"
   *       amount:                   50
   *       delay:                    100
   *       pipelineBaseParameters:  '{ "parameterName": "custom data" }'
   *       pipelineMultiParameters: '[ { "multiParameterName": "custom data" } ]'
   *       executionID:             'QWERTYUIOP'
   */

  const broadsideRequest = JSON.stringify({
    application: executions[0].application,
    pipelineNameOrId: executions[0].name,
    amount: executions.length,
    pipelineMultiParameters: executions.map((e) => e.trigger.parameters),
    executionID: getParentExecutionId(executions[0]),
  });

  return fetch(BROADSIDE_URI, {
    method: 'POST',
    credentials: 'include',
    body: broadsideRequest,
  });
};

const getParentExecutionId = (e: IExecution) => {
  let executionID;
  const parent = e.trigger.parentExecution;
  const parameters = e.trigger.parameters;

  if (parent && parent.id) {
    executionID = parent.id;
  } else if (parameters && parameters['parentExecutionId']) {
    executionID = parameters['parentExecutionId'];
  } else {
    executionID = e.id;
  }

  return executionID;
};

export const broadside = { retriggerExecutions };
