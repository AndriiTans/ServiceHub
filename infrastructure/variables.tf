variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "env" {
  description = "Environment (dev, prod)"
  type        = string
}

variable "memory_size" {
  description = "Memory size for Lambda functions"
  type        = number
  default     = 128
}

variable "timeout" {
  description = "Timeout for Lambda functions in seconds"
  type        = number
  default     = 15
}
