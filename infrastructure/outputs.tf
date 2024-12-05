output "auth_lambda_arn" {
  value = module.lambda_auth.lambda_arn
}

output "shop_lambda_arn" {
  value = module.lambda_shop.lambda_arn
}

output "api_gateway_url" {
  value = module.api_gateway.api_url
}
