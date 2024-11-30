output "lambda_endpoints" {
  description = "API Gateway endpoints for Lambda services"
  value = {
    auth_service = module.auth_service.api_gateway_url
    shop_service = module.shop_service.api_gateway_url
    web_service  = module.web_service.api_gateway_url
  }
}
