##############################################################################
#                      GENERAL                                               #
##############################################################################
application = "snapit"
aws_region  = "us-east-1"

##############################################################################
#                      COGNITO                                               #
##############################################################################
cognito_schema_definition = [
  {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true
  },
  {
    attribute_data_type = "String"
    name                = "name"
    required            = true
    mutable             = true
  }
]

cognito_password_policy = {
  minimum_length    = 6
  require_lowercase = false
  require_numbers   = false
  require_symbols   = false
  require_uppercase = false
}

##############################################################################
#                      LAMBDA                                                #
##############################################################################
lambda_config = [
  {
    function_name  = "CriarUsuarioCognito"
    directory_name = "post_function"
    zip_file_name  = "create_user.zip"
    handler        = "create_user.handler"
    runtime        = "nodejs16.x"
    timeout        = 30
    is_authorizer  = false
  },
  {
    function_name  = "LogarUsuarioCognito"
    directory_name = "post_function"
    zip_file_name  = "login.zip"
    handler        = "login.handler"
    runtime        = "nodejs16.x"
    timeout        = 30
    is_authorizer  = false
  }
]
