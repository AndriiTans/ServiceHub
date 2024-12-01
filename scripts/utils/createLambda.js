const {
  LambdaClient,
  CreateFunctionCommand,
  UpdateFunctionCodeCommand,
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

const createLambdaFunction = async (functionName, roleArn, zipFilePath, handler) => {
  const client = new LambdaClient({ region: 'us-east-1' });

  console.log('Checking if Lambda function already exists...');
  try {
    console.log('Current working directory:', process.cwd());

    const currentDir = process.cwd();
    listFiles(`${currentDir}/scripts`);
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

    // Update the existing function
    const zipFile = fs.readFileSync(zipFilePath);

    console.log('zipFile ->>', zipFile);

    const updateFunctionCodeCommand = new UpdateFunctionCodeCommand({
      FunctionName: functionName,
      ZipFile: zipFile,
    });
    const updateResponse = await client.send(updateFunctionCodeCommand);
    console.log(`Lambda function updated: ${updateResponse.FunctionArn}`);
    return updateResponse.FunctionArn;
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
      });
      const createResponse = await client.send(createFunctionCommand);
      console.log(`Lambda function created: ${createResponse.FunctionArn}`);
      return createResponse.FunctionArn;
    }

    // Re-throw other errors
    console.error('Error while checking/creating Lambda function:', error.message);
    throw error;
  }
};

module.exports = { createLambda: createLambdaFunction };
