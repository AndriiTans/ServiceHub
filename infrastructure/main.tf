provider "aws" {
  region = var.aws_region
}

# Call Lambda module for each service
module "auth_service" {
  source       = "./modules/lambda"
  service_name = "auth-service"
  env          = var.env
  memory_size  = 128
  timeout      = 15
}

module "shop_service" {
  source       = "./modules/lambda"
  service_name = "shop-service"
  env          = var.env
  memory_size  = 128
  timeout      = 15
}

module "web_service" {
  source       = "./modules/lambda"
  service_name = "web-service"
  env          = var.env
  memory_size  = 256
  timeout      = 30
}

# VPC Module (optional for Lambda if needed)
module "vpc" {
  source = "./modules/vpc"
}

# Output service endpoints
output "lambda_endpoints" {
  value = {
    auth_service = module.auth_service.api_gateway_url
    shop_service = module.shop_service.api_gateway_url
    web_service  = module.web_service.api_gateway_url
  }
}
