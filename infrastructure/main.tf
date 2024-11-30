provider "aws" {
  region = var.region
}

module "lambda_auth" {
  source = "./lambda"
  function_name = "auth-service"
  handler = "index.handler"
  runtime = "nodejs18.x"
  environment = {
    NODE_ENV = "production"
    AUTH_DB_URL = var.auth_db_url
    JWT_SECRET_KEY = var.jwt_secret_key
  }
  filename = "../services/auth-service/index.js"
}

module "lambda_shop" {
  source = "./lambda"
  function_name = "shop-service"
  handler = "index.handler"
  runtime = "nodejs18.x"
  environment = {
    NODE_ENV = "production"
    SHOP_DB_URL = var.shop_db_url
  }
  filename = "../services/shop-service/index.js"
}

module "api_gateway" {
  source = "./api_gateway"
  rest_api_name = "MyAPIGateway"
  auth_lambda_arn = module.lambda_auth.lambda_arn
  shop_lambda_arn = module.lambda_shop.lambda_arn
}
