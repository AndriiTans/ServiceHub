module "lambda_auth" {
  source        = "./lambda"
  function_name = "auth-service"
  handler       = "dist/index.handler" # Ensure this matches your compiled handler
  runtime       = "nodejs18.x"
  environment = {
    NODE_ENV     = "production"
    AUTH_DB_URL  = var.auth_db_url
    JWT_SECRET_KEY = var.jwt_secret_key
  }
  filename = "auth-service.zip" # Path to the auth-service ZIP
}

module "lambda_shop" {
  source        = "./lambda"
  function_name = "shop-service"
  handler       = "dist/main.handler" # Ensure this matches your compiled handler
  runtime       = "nodejs18.x"
  environment = {
    NODE_ENV    = "production"
    SHOP_DB_URL = var.shop_db_url
  }
  filename = "shop-service.zip" # Path to the shop-service ZIP
}

module "api_gateway" {
  source          = "./api_gateway"
  lambda_auth_arn = module.lambda_auth.lambda_arn       # Correct reference
  lambda_shop_arn = module.lambda_shop.lambda_arn_shop # Correct reference
  aws_region      = var.region
}
