const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const createUser = async (event) => {
  try {
    const { email, name, password } = event;
    const userPoolId = process.env.USER_POOL_ID;

    if (!email || !name || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Campos obrigatórios faltando: email, name, password' })
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Formato de email inválido' })
      };
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'A senha deve ter pelo menos 8 caracteres' })
      };
    }

    const params = {
      UserPoolId: userPoolId,
      Username: email,
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
      ],
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS'
    };

    await cognito.adminCreateUser(params).promise();

    await cognito.adminSetUserPassword({
      UserPoolId: userPoolId,
      Username: email,
      Password: password,
      Permanent: true
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Usuário criado com sucesso'
      })
    };

  } catch (error) {
    console.error('Erro ao criar usuário:', error);

    if (error.code === 'UsernameExistsException') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Usuário já existe' })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao criar usuário', error: error.message })
    };
  }
};

exports.handler = createUser;