output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "subnets" {
  description = "List of subnet IDs"
  value       = aws_subnet.subnet[*].id
}
