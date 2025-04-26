const {
  IAMClient,
  CreateRoleCommand,
  GetRoleCommand,
  AttachRolePolicyCommand,
} = require('@aws-sdk/client-iam');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createIAMRole = async (roleName) => {
  const client = new IAMClient({ region: 'us-east-1' });
  const assumeRolePolicyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'lambda.amazonaws.com', // Lambda service
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

      // Create the role
      const createRoleCommand = new CreateRoleCommand({
        RoleName: roleName,
        AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicyDocument),
      });
      const createResponse = await client.send(createRoleCommand);

      console.log('IAM Role created:', createResponse.Role.Arn);

      // Attach the AWSLambdaBasicExecutionRole policy
      const attachPolicyCommand = new AttachRolePolicyCommand({
        RoleName: roleName,
        PolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      });
      await client.send(attachPolicyCommand);
      console.log(`Policy AWSLambdaBasicExecutionRole attached to role: ${roleName}`);

      // Wait for the role to be fully available
      await sleep(5000); // Wait for 5 seconds
      return createResponse.Role.Arn;
    }

    console.error('Error checking or creating IAM Role:', error.message);
    throw error;
  }
};

module.exports = { createIAMRole };
