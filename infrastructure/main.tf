module "lambda_auth" {
  source = "./lambda"
  function_name = "auth-service"
  handler       = "dist/index.handler"
  runtime       = "nodejs18.x"
  environment   = {
    NODE_ENV = "production"
  }
}

module "lambda_shop" {
  source = "./lambda"
  function_name = "shop-service"
  handler       = "dist/main.handler"
  runtime       = "nodejs18.x"
  environment   = {
    NODE_ENV = "production"
  }
}

module "api_gateway" {
  source          = "./api_gateway"
  lambda_auth_arn = module.lambda_auth.lambda_arn       # Correct reference
  lambda_shop_arn = module.lambda_shop.lambda_arn_shop # Correct reference
  aws_region      = var.region
}
