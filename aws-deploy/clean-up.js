const { LambdaClient, DeleteFunctionCommand } = require('@aws-sdk/client-lambda');
const { IAMClient, DeleteRoleCommand } = require('@aws-sdk/client-iam');
const { APIGatewayClient, DeleteRestApiCommand } = require('@aws-sdk/client-apigateway');

const cleanUp = async () => {
  const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION || 'us-east-1' });
  const iamClient = new IAMClient({ region: process.env.AWS_REGION || 'us-east-1' });
  const apiGatewayClient = new APIGatewayClient({ region: process.env.AWS_REGION || 'us-east-1' });

  try {
    console.log('Cleaning up Lambda function...');
    const deleteLambdaCommand = new DeleteFunctionCommand({ FunctionName: 'my-lambda-function' });
    await lambdaClient.send(deleteLambdaCommand);
    console.log('Lambda function deleted.');

    console.log('Cleaning up IAM role...');
    const deleteRoleCommand = new DeleteRoleCommand({ RoleName: 'my-lambda-role' });
    await iamClient.send(deleteRoleCommand);
    console.log('IAM role deleted.');

    console.log('Cleaning up API Gateway...');
    const deleteApiGatewayCommand = new DeleteRestApiCommand({ restApiId: 'my-api-id' });
    await apiGatewayClient.send(deleteApiGatewayCommand);
    console.log('API Gateway deleted.');
  } catch (error) {
    console.error('Clean-up failed:', error.message);
  }
};

// Execute the cleanup
cleanUp().catch((error) => console.error('Unexpected error during clean-up:', error.message));
