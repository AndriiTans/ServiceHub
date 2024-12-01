const AWS = require('aws-sdk');
const fs = require('fs');

const lambda = new AWS.Lambda({ region: 'us-east-1' });

const createLambda = async (functionName, roleArn, zipFilePath) => {
  const zipFile = fs.readFileSync(zipFilePath);

  const params = {
    FunctionName: functionName,
    Runtime: 'nodejs18.x',
    Role: roleArn,
    Handler: 'dist/index.handler',
    Code: { ZipFile: zipFile },
    Timeout: 10,
    MemorySize: 128,
  };

  const response = await lambda.createFunction(params).promise();
  return response.FunctionArn;
};

module.exports = { createLambda };
