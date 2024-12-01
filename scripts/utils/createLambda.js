const { LambdaClient, CreateFunctionCommand } = require('@aws-sdk/client-lambda');
const fs = require('fs');
const path = require('path');

const listFiles = (dir) => {
  console.log(`Contents of ${dir}:`);
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.name !== 'scripts') return; // Skip node_modules
    const fullPath = path.join(dir, entry.name);
    console.log(entry.isDirectory() ? `[DIR] ${fullPath}` : fullPath);
    if (entry.isDirectory()) listFiles(fullPath); // Recurse into subdirectories
  });
};

const createLambdaFunction = async (functionName, roleArn, zipFilePath, handler) => {
  const client = new LambdaClient({ region: 'us-east-1' });
  console.log('Current working directory:', process.cwd());
  const currentDir = process.cwd();
  listFiles(currentDir);
  listFiles(`${currentDir}/scripts`);
  console.log('zipFilePath');
  console.log('zipFilePath -> ', zipFilePath);
  console.log('zipFilePath');
  if (!fs.existsSync(zipFilePath)) {
    throw new Error(`ZIP file not found: ${zipFilePath}`);
  }

  const params = {
    FunctionName: functionName,
    Role: roleArn,
    Runtime: 'nodejs18.x',
    Handler: handler,
    Code: {
      ZipFile: fs.readFileSync(zipFilePath),
    },
  };

  try {
    const command = new CreateFunctionCommand(params);
    const response = await client.send(command);
    console.log('Lambda function created:', response.FunctionArn);
    return response.FunctionArn;
  } catch (error) {
    console.error('Error creating Lambda function:', error);
    throw error;
  }
};

module.exports = { createLambda: createLambdaFunction };
