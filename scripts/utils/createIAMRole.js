const { IAMClient, CreateRoleCommand, GetRoleCommand } = require('@aws-sdk/client-iam');

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

  try {
    // Check if the role already exists
    console.log(`Checking if role "${roleName}" exists...`);
    const getRoleCommand = new GetRoleCommand({ RoleName: roleName });
    const response = await client.send(getRoleCommand);

    console.log(`Role already exists: ${response.Role.Arn}`);
    return response.Role.Arn;
  } catch (error) {
    // Handle case where the role doesn't exist
    if (error.name === 'NoSuchEntity' || error.message.includes('cannot be found')) {
      console.log(`Role "${roleName}" does not exist. Creating it...`);

      // Role does not exist, create it
      const params = {
        RoleName: roleName,
        AssumeRolePolicyDocument: JSON.stringify(policyDocument),
      };

      const createRoleCommand = new CreateRoleCommand(params);
      const createResponse = await client.send(createRoleCommand);

      console.log('IAM Role created:', createResponse.Role.Arn);
      return createResponse.Role.Arn;
    }

    // Other errors
    console.error('Error checking or creating IAM Role:', error.message);
    throw error;
  }
};

module.exports = { createIAMRole };
