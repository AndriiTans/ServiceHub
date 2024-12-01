const { createLambda } = require('./utils/createLambda');
const { createApiGateway } = require('./utils/createApiGateway');
const { createIAMRole } = require('./utils/createIAMRole');

(async () => {
  try {
    const roleName = 'my-lambda-role';
    const lambdaFunctionName = 'my-lambda-function';
    const apiName = 'my-api-gateway';

    // Step 1: Create IAM Role
    console.log('Creating IAM Role...');
    const roleArn = await createIAMRole(roleName);
    console.log(`IAM Role created: ${roleArn}`);

    // Step 2: Deploy Lambda Function
    console.log('Deploying Lambda Function...');
    const lambdaArn = await createLambda(
      lambdaFunctionName,
      roleArn,
      './scripts/dist-package-auth.zip',
    );
    console.log(`Lambda Function deployed: ${lambdaArn}`);

    // Step 3: Set up API Gateway
    console.log('Creating API Gateway...');
    const apiUrl = await createApiGateway(apiName, lambdaArn);
    console.log(`API Gateway deployed: ${apiUrl}`);
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
})();
