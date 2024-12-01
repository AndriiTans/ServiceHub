const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();
const iam = new AWS.IAM();
const apiGateway = new AWS.APIGateway();

const cleanUp = async () => {
  try {
    console.log('Cleaning up Lambda functions...');
    await lambda.deleteFunction({ FunctionName: 'my-lambda-function' }).promise();
    console.log('Lambda function deleted.');

    console.log('Cleaning up IAM roles...');
    await iam.deleteRole({ RoleName: 'my-lambda-role' }).promise();
    console.log('IAM role deleted.');

    console.log('Cleaning up API Gateway...');
    await apiGateway.deleteRestApi({ restApiId: 'my-api-id' }).promise();
    console.log('API Gateway deleted.');
  } catch (error) {
    console.error('Clean-up failed:', error.message);
  }
};

cleanUp();
