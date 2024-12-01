const { createLambda } = require('./utils/createLambda');
const { createApiGateway } = require('./utils/createApiGateway');
const { createIAMRole } = require('./utils/createIAMRole');

(async () => {
  try {
    // Define roles, functions, and API details for both services
    const services = [
      {
        roleName: 'auth-service-role',
        lambdaFunctionName: 'auth-service',
        zipFilePath: './aws-deploy/dist-package-auth.zip',
        handler: 'dist/index.handler',
        apiName: 'auth-api-gateway',
        endpointPath: 'auth-endpoint',
      },
      {
        roleName: 'shop-service-role',
        lambdaFunctionName: 'shop-service',
        zipFilePath: './aws-deploy/dist-package-shop.zip',
        handler: 'dist/src/main.handler',
        apiName: 'shop-api-gateway',
        endpointPath: 'shop-endpoint',
      },
    ];

    for (const service of services) {
      console.log(`Deploying ${service.lambdaFunctionName}...`);

      // Step 1: Create IAM Role
      console.log(`Creating IAM Role for ${service.lambdaFunctionName}...`);
      const roleArn = await createIAMRole(service.roleName);
      console.log(`IAM Role created for ${service.lambdaFunctionName}: ${roleArn}`);

      // Step 2: Deploy Lambda Function
      console.log(`Deploying Lambda Function for ${service.lambdaFunctionName}...`);
      const lambdaArn = await createLambda(
        service.lambdaFunctionName,
        roleArn,
        service.zipFilePath,
        service.handler,
      );
      console.log(`Lambda Function deployed for ${service.lambdaFunctionName}: ${lambdaArn}`);

      // Step 3: Set up API Gateway
      console.log(`Creating API Gateway for ${service.lambdaFunctionName}...`);
      const apiUrl = await createApiGateway(service.apiName, lambdaArn, service.endpointPath);
      console.log(`API Gateway deployed for ${service.lambdaFunctionName}: ${apiUrl}`);
    }

    console.log('Deployment completed successfully for all services!');
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
})();
