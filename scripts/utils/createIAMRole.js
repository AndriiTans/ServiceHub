const {
  IAMClient,
  CreateRoleCommand,
  GetRoleCommand,
  AttachRolePolicyCommand,
} = require('@aws-sdk/client-iam');

const createIAMRole = async (roleName) => {
  const client = new IAMClient({ region: 'us-east-1' });
  const assumeRolePolicyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'lambda.amazonaws.com', // Allows Lambda to assume this role
        },
        Action: 'sts:AssumeRole',
      },
    ],
  };

  try {
    // Check if the role already exists
    console.log(`Checking if role "${roleName}" exists...`);
    const getRoleCommand = new GetRoleCommand({ RoleName: roleName });
    const response = await client.send(getRoleCommand);

    console.log(`Role already exists: ${response.Role.Arn}`);
    return response.Role.Arn;
  } catch (error) {
    if (error.name === 'NoSuchEntity' || error.message.includes('cannot be found')) {
      console.log(`Role "${roleName}" does not exist. Creating it...`);

      // Role does not exist, create it
      const createRoleCommand = new CreateRoleCommand({
        RoleName: roleName,
        AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicyDocument),
      });
      const createResponse = await client.send(createRoleCommand);

      console.log('IAM Role created:', createResponse.Role.Arn);

      // Attach the AWSLambdaBasicExecutionRole policy to the role
      const attachPolicyCommand = new AttachRolePolicyCommand({
        RoleName: roleName,
        PolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      });
      await client.send(attachPolicyCommand);
      console.log(`Attached AWSLambdaBasicExecutionRole policy to ${roleName}`);

      return createResponse.Role.Arn;
    }

    // Other errors
    console.error('Error checking or creating IAM Role:', error.message);
    throw error;
  }
};

module.exports = { createIAMRole };
