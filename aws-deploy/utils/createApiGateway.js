const {
  APIGatewayClient,
  CreateRestApiCommand,
  GetResourcesCommand,
  CreateResourceCommand,
  PutMethodCommand,
  PutIntegrationCommand,
  CreateDeploymentCommand,
} = require('@aws-sdk/client-api-gateway');

/**
 * Create API Gateway and integrate it with a Lambda function.
 * @param {string} apiName - The name of the API Gateway
 * @param {string} lambdaArn - The ARN of the Lambda function to integrate
 * @returns {Promise<string>} - The endpoint URL of the deployed API
 */
const createApiGateway = async (apiName, lambdaArn) => {
  if (!apiName || !lambdaArn) {
    throw new Error('Both apiName and lambdaArn are required parameters.');
  }

  const client = new APIGatewayClient({ region: process.env.AWS_REGION || 'us-east-1' });

  try {
    console.log(`Creating API Gateway: ${apiName}`);

    // Step 1: Create the REST API
    const createRestApiCommand = new CreateRestApiCommand({ name: apiName });
    const restApi = await client.send(createRestApiCommand);
    console.log(`API Gateway created with ID: ${restApi.id}`);

    // Step 2: Get the root resource ID
    const getResourcesCommand = new GetResourcesCommand({ restApiId: restApi.id });
    const rootResource = await client.send(getResourcesCommand);
    const rootResourceId = rootResource.items.find((item) => item.path === '/').id;
    console.log(`Root resource ID: ${rootResourceId}`);

    // Step 3: Create a new resource (e.g., /my-endpoint)
    const createResourceCommand = new CreateResourceCommand({
      restApiId: restApi.id,
      parentId: rootResourceId,
      pathPart: 'my-endpoint',
    });
    const resource = await client.send(createResourceCommand);
    console.log(`Resource created with ID: ${resource.id}`);

    // Step 4: Add a POST method to the resource
    const putMethodCommand = new PutMethodCommand({
      restApiId: restApi.id,
      resourceId: resource.id,
      httpMethod: 'POST',
      authorizationType: 'NONE',
    });
    await client.send(putMethodCommand);
    console.log('POST method added to the resource.');

    // Step 5: Integrate the Lambda function with the POST method
    const integrationUri = `arn:aws:apigateway:${
      process.env.AWS_REGION || 'us-east-1'
    }:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`;
    const putIntegrationCommand = new PutIntegrationCommand({
      restApiId: restApi.id,
      resourceId: resource.id,
      httpMethod: 'POST',
      type: 'AWS_PROXY',
      integrationHttpMethod: 'POST',
      uri: integrationUri,
    });
    await client.send(putIntegrationCommand);
    console.log(`Lambda function integrated with URI: ${integrationUri}`);

    // Step 6: Deploy the API to a stage (e.g., 'prod')
    const createDeploymentCommand = new CreateDeploymentCommand({
      restApiId: restApi.id,
      stageName: 'prod',
    });
    const deployment = await client.send(createDeploymentCommand);
    console.log(`API deployed to stage: prod`);

    // Step 7: Return the API Gateway endpoint URL
    const endpointUrl = `https://${restApi.id}.execute-api.${
      process.env.AWS_REGION || 'us-east-1'
    }.amazonaws.com/prod/my-endpoint`;
    console.log(`API Gateway endpoint: ${endpointUrl}`);

    return endpointUrl;
  } catch (error) {
    console.error('Error creating API Gateway:', error);
    throw error;
  }
};

module.exports = { createApiGateway };
