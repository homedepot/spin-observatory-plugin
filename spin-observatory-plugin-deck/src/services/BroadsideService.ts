import type { IExecution } from '@spinnaker/core';
import { SETTINGS } from '@spinnaker/core';
// http://broadside.cd:80
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
  // eslint-disable-next-line no-console
  console.log({ executions });

  const application = executions[0].application;
  const pipelineNameOrId = executions[0].name;
  const amount = executions.length;
  const pipelineMultiParameters = executions.map((e) => e.trigger.parameters);

  return fetch(BROADSIDE_URI, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ application, pipelineNameOrId, amount, pipelineMultiParameters }),
  });
};

export const broadside = { retriggerExecutions };
