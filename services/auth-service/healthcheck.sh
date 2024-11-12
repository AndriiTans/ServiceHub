#!/bin/sh

# Check if the healthcheck was already successful
if [ -f /tmp/healthcheck_success ]; then
  echo "Healthcheck already successful, skipping further checks."
  exit 0
fi

# Perform the healthcheck by sending a request to the /health endpoint
curl -f http://auth-service:${AUTH_SERVICE_PORT}/health

# If the healthcheck passed, create a success marker file
if [ $? -eq 0 ]; then
  touch /tmp/healthcheck_success
  exit 0
else
  exit 1
fi
