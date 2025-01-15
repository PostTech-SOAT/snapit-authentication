const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const authenticateUser = async (event) => {
  const { email, password } = event;

  const params = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    ClientId: process.env.CLIENT_ID,
    UserPoolId: process.env.USER_POOL_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  }

  const data = await cognito.initiateAuth(params).promise();

  if (!data) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid credentials' })
    };
  }

  const response = data.AuthenticationResult.AccessToken;

  return {
    statusCode: 200,
    body: JSON.stringify({ token: response })
  };
};

exports.handler = authenticateUser;