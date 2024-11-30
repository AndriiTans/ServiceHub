variable "service_name" {
  description = "Name of the service"
  type        = string
}

variable "env" {
  description = "Environment (dev, prod)"
  type        = string
}

variable "memory_size" {
  description = "Memory size for Lambda"
  type        = number
}

variable "timeout" {
  description = "Timeout for Lambda in seconds"
  type        = number
}
