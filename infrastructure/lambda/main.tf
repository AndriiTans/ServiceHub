resource "random_string" "suffix" {
  length  = 6
  special = false
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.function_name}_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })

  lifecycle {
    prevent_destroy       = true
    create_before_destroy = true
    ignore_changes        = [name]
  }
}

# Lambda for Auth Service
resource "aws_lambda_function" "auth_service" {
  function_name = "auth-service"
  timeout       = 10
  handler       = "dist/index.handler" # This points to the index.js file
  runtime       = var.runtime
  role          = aws_iam_role.lambda_execution_role.arn
  filename      = "${path.module}/dist-package-auth.zip" # Ensure this ZIP contains `dist/index.js`
  environment {
    variables = var.environment
  }
}

resource "aws_lambda_function" "shop_service" {
  function_name = "shop-service"
  timeout       = 10
  handler       = "src/main.handler" # Update the handler path to include "src/"
  runtime       = var.runtime
  role          = aws_iam_role.lambda_execution_role.arn
  filename      = "${path.module}/dist-package-shop.zip" # Ensure this ZIP contains `dist/src/main.js`
  environment {
    variables = var.environment
  }
}


# Attach logging policy to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_logging" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "auth_log_group" {
  name              = "/aws/lambda/auth-service"
  retention_in_days = var.log_retention_days

  lifecycle {
    create_before_destroy = true
    prevent_destroy       = true
    ignore_changes        = [retention_in_days]
  }
}

resource "aws_cloudwatch_log_group" "shop_log_group" {
  name              = "/aws/lambda/shop-service"
  retention_in_days = var.log_retention_days

  lifecycle {
    create_before_destroy = true
    prevent_destroy       = true
    ignore_changes        = [retention_in_days]
  }
}


# Outputs for the ARNs of both Lambda functions
output "auth_lambda_arn" {
  value = aws_lambda_function.auth_service.arn
}

output "shop_lambda_arn" {
  value = aws_lambda_function.shop_service.arn
}
