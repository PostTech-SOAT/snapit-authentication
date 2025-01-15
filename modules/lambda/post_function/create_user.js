const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const createUser = async (event) => {
  const body = JSON.parse(JSON.stringify(event));
  const { email, name, password } = body;
  const userPoolId = process.env.USER_POOL_ID;

  try {
    const params = {
      UserPoolId: userPoolId,
      Username: name,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'name',
          Value: name
        },
        {
          Name: 'email_verified',
          Value: 'true'
        },

      ]
    };

    const data = await cognito.adminCreateUser(params)
      .promise()
      .then(async (data) => {
        await cognito.adminSetUserPassword(
          {
            UserPoolId: userPoolId,
            Username: data.username,
            Password: password,
            Permanent: true
          }).promise();
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User created successfully',
        user: data,
        token: data.token
      })
    };
  } catch (error) {
    if (error.code === 'UsernameExistsException') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User already exists' })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating user', error: error.message })
    };
  }
};

exports.handler = createUser;