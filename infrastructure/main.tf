provider "aws" {
  region = var.region
}

module "lambda_auth" {
  source        = "./lambda"
  function_name = "auth-service"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  environment = {
    NODE_ENV      = "production"
    AUTH_DB_URL   = var.auth_db_url
    JWT_SECRET_KEY = var.jwt_secret_key
  }
  filename = "auth-service.zip"
}

module "lambda_shop" {
  source        = "./lambda"
  function_name = "shop-service"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  environment = {
    NODE_ENV    = "production"
    SHOP_DB_URL = var.shop_db_url
  }
  filename = "shop-service.zip"
}

module "api_gateway" {
  source          = "./api_gateway"
  lambda_auth_arn = module.lambda_auth.lambda_arn
  lambda_shop_arn = module.lambda_shop.lambda_arn
  aws_region      = var.region
  rest_api_name   = "MyServiceAPI" # Customize the name for your API Gateway
}
