const { IAMClient, CreateRoleCommand } = require('@aws-sdk/client-iam');

const createIAMRole = async (roleName) => {
  const client = new IAMClient({ region: 'us-east-1' });
  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
        Action: 'sts:AssumeRole',
      },
    ],
  };

  const params = {
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify(policyDocument),
  };

  try {
    const command = new CreateRoleCommand(params);
    const response = await client.send(command);
    console.log('IAM Role created:', response.Role.Arn);
    return response.Role.Arn;
  } catch (error) {
    console.error('Error creating IAM Role:', error.message);
    throw error;
  }
};

module.exports = { createIAMRole };
