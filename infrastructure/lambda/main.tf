resource "random_string" "suffix" {
  length  = 6
  special = false
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.function_name}_execution_role_${random_string.suffix.id}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lambda_function" "this" {
  function_name = var.function_name
  handler       = var.handler
  runtime       = var.runtime
  role          = aws_iam_role.lambda_execution_role.arn
  filename      = "${path.module}/${var.filename}" # Ensure correct relative path
  environment {
    variables = var.environment
  }
}

output "lambda_arn" {
  value = aws_lambda_function.this.arn
}
