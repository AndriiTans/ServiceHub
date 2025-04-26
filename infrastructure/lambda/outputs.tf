output "lambda_arn" {
  value = aws_lambda_function.auth_service.arn
}

output "lambda_arn_shop" {
  value = aws_lambda_function.shop_service.arn
}
