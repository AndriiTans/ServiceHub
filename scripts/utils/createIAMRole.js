const { IAMClient, CreateRoleCommand } = require('@aws-sdk/client-iam');

const createIAMRole = async (roleName, policyDocument) => {
  const client = new IAMClient({ region: 'us-east-1' });
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
    console.error('Error creating IAM Role:', error);
    throw error;
  }
};

module.exports = createIAMRole;
