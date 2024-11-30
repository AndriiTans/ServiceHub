output "api_gateway_url" {
  description = "API Gateway endpoint for the service"
  value       = aws_apigatewayv2_api.api_gateway.api_endpoint
}
