variable "function_name" {
  description = "Name of the Lambda function"
}

variable "handler" {
  description = "Lambda handler"
}

variable "runtime" {
  description = "Runtime environment for the Lambda function"
}

variable "filename" {
  description = "Path to the function code file"
}

variable "environment" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}
