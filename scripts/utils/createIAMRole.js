const AWS = require('aws-sdk');

const iam = new AWS.IAM();

const createIAMRole = async (roleName) => {
  const assumeRolePolicyDocument = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { Service: 'lambda.amazonaws.com' },
        Action: 'sts:AssumeRole',
      },
    ],
  });

  const role = await iam
    .createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: assumeRolePolicyDocument,
    })
    .promise();

  // Attach AWSLambdaBasicExecutionRole policy
  await iam
    .attachRolePolicy({
      RoleName: roleName,
      PolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
    })
    .promise();

  return role.Arn;
};

module.exports = { createIAMRole };
