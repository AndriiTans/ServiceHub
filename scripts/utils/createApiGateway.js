const AWS = require('aws-sdk');

const apiGateway = new AWS.APIGateway({ region: 'us-east-1' });

const createApiGateway = async (apiName, lambdaArn) => {
  const restApi = await apiGateway.createRestApi({ name: apiName }).promise();
  const rootResource = await apiGateway.getResources({ restApiId: restApi.id }).promise();
  const rootResourceId = rootResource.items.find((item) => item.path === '/').id;

  // Create a new resource
  const resource = await apiGateway
    .createResource({
      restApiId: restApi.id,
      parentId: rootResourceId,
      pathPart: 'my-endpoint',
    })
    .promise();

  // Add POST method to resource
  await apiGateway
    .putMethod({
      restApiId: restApi.id,
      resourceId: resource.id,
      httpMethod: 'POST',
      authorizationType: 'NONE',
    })
    .promise();

  // Integrate Lambda with API Gateway
  await apiGateway
    .putIntegration({
      restApiId: restApi.id,
      resourceId: resource.id,
      httpMethod: 'POST',
      type: 'AWS_PROXY',
      integrationHttpMethod: 'POST',
      uri: `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`,
    })
    .promise();

  // Deploy the API
  const deployment = await apiGateway
    .createDeployment({
      restApiId: restApi.id,
      stageName: 'prod',
    })
    .promise();

  return `https://${restApi.id}.execute-api.us-east-1.amazonaws.com/prod/my-endpoint`;
};

module.exports = { createApiGateway };
