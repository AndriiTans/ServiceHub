const {
  LambdaClient,
  CreateFunctionCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
  GetFunctionCommand,
} = require('@aws-sdk/client-lambda');
const fs = require('fs');
const path = require('path');

const listFiles = (dir) => {
  console.log(`Contents of ${dir}:`);
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name === 'node_modules') return; // Skip node_modules
    const fullPath = path.join(dir, entry.name);
    console.log(entry.isDirectory() ? `[DIR] ${fullPath}` : fullPath);
    if (entry.isDirectory()) listFiles(fullPath); // Recurse into subdirectories
  });
};

const createLambdaFunction = async (
  functionName,
  roleArn,
  zipFilePath,
  handler,
  environmentVars,
) => {
  console.log('environmentVars ---> ', environmentVars);
  const client = new LambdaClient({ region: 'us-east-1' });

  console.log(`Deploying Lambda Function: ${functionName}`);
  try {
    console.log('Current working directory:', process.cwd());

    const currentDir = process.cwd();
    listFiles(`${currentDir}/aws-deploy`);
    console.log('zipFilePath');
    console.log('zipFilePath -> ', zipFilePath);
    console.log('zipFilePath');

    if (!fs.existsSync(zipFilePath)) {
      throw new Error(`ZIP file not found: ${zipFilePath}`);
    }

    console.log('ZIP file found, reading file...');
    const getFunctionCommand = new GetFunctionCommand({ FunctionName: functionName });
    await client.send(getFunctionCommand);
    console.log(`Lambda function "${functionName}" already exists. Updating...`);

    // Update existing Lambda function code
    const zipFile = fs.readFileSync(zipFilePath);
    const updateFunctionCodeCommand = new UpdateFunctionCodeCommand({
      FunctionName: functionName,
      ZipFile: zipFile,
    });
    const updateCodeResponse = await client.send(updateFunctionCodeCommand);
    console.log(`Updated Lambda function code for: ${updateCodeResponse.FunctionArn}`);

    // Update environment variables
    const updateFunctionConfigCommand = new UpdateFunctionConfigurationCommand({
      FunctionName: functionName,
      Environment: {
        Variables: environmentVars,
      },
    });
    const updateConfigResponse = await client.send(updateFunctionConfigCommand);
    console.log(`Updated Lambda environment variables for: ${updateConfigResponse.FunctionArn}`);
    return updateCodeResponse.FunctionArn;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      console.log(`Lambda function "${functionName}" does not exist. Creating it...`);

      // Create the function if it doesn't exist
      const zipFile = fs.readFileSync(zipFilePath);
      const createFunctionCommand = new CreateFunctionCommand({
        FunctionName: functionName,
        Role: roleArn,
        Runtime: 'nodejs18.x',
        Handler: handler,
        Code: {
          ZipFile: zipFile,
        },
        Environment: {
          Variables: environmentVars,
        },
      });
      const createResponse = await client.send(createFunctionCommand);
      console.log(`Lambda function created: ${createResponse.FunctionArn}`);
      return createResponse.FunctionArn;
    }

    console.error('Error creating/updating Lambda function:', error.message);
    throw error;
  }
};

module.exports = { createLambda: createLambdaFunction };
