data "aws_iam_role" "lambda_exec_role" {
  name = "LabRole"
}

data "aws_cognito_user_pool_clients" "main" {
  user_pool_id = module.cognito.cognito_data.id
}

data "aws_cognito_user_pool_client" "name" {
  client_id    = data.aws_cognito_user_pool_clients.main.client_ids[0]
  user_pool_id = module.cognito.cognito_data.id
}
