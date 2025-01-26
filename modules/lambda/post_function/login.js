const AWS = require('aws-sdk');
const crypto = require('crypto');
const cognito = new AWS.CognitoIdentityServiceProvider();

function getSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

const authenticateUser = async (event) => {

  const { email, password } = event;

  if (!email || !password) {
    console.error('Campos obrigatórios faltando:', { email, password });
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Campos obrigatórios faltando: email e password' })
    };
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  let authParameters = {
    USERNAME: email,
    PASSWORD: password
  };

  if (clientSecret) {
    authParameters.SECRET_HASH = getSecretHash(email, clientId, clientSecret);
  }

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: authParameters
  };

  try {

    const data = await cognito.initiateAuth(params).promise();
    if (!data.AuthenticationResult) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Credenciais inválidas' })
      };
    }

    const AccessToken = data.AuthenticationResult;
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Autenticação bem-sucedida',
        accessToken: AccessToken,
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao autenticar usuário', error: error.message })
    };
  }
};

exports.handler = authenticateUser;