variable "lambda_auth_arn" {
  description = "ARN of the Lambda function for auth"
}

variable "lambda_shop_arn" {
  description = "ARN of the Lambda function for shop"
}

variable "aws_region" {
  description = "AWS region"
}

variable "rest_api_name" {
  description = "Name of the API Gateway REST API"
  type        = string
  default     = "MyAPIGateway" # You can modify this default value as needed
}
