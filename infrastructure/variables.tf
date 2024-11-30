variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "auth_db_url" {
  description = "Database URL for auth service"
}

variable "shop_db_url" {
  description = "Database URL for shop service"
}

variable "jwt_secret_key" {
  description = "JWT secret key for authentication"
}
