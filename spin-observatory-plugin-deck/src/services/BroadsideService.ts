import type { IExecution } from '@spinnaker/core';
import { REST } from '@spinnaker/core';
// http://broadside.cd:80
const BROADSIDE_URI = '/v1/broadsides';

// See https://github.com/one-thd/broadside/blob/main/api/swagger.yml#L206
export const retriggerExecutions = ({ executions }: { executions: IExecution[] }): Promise<any[]> => {
  /***
   *  application: "clipper"
   *       pipelineNameOrId: "Generate Clipper X.509 Key Pair"
   *       amount: 50
   *       delay: 100
   *       pipelineBaseParameters: '{ "parameterName": "custom data" }'
   *       pipelineMultiParameters: '[ { "multiParameterName": "custom data" } ]'
   */
  // eslint-disable-next-line no-console
  console.log({ executions });
  return Promise.all(
    executions.map(async (execution) => {
      return await REST(BROADSIDE_URI).post({
        application: execution.application,
        pipelineNameOrId: execution.pipelineConfig.id,
      });
    }),
  );
};
