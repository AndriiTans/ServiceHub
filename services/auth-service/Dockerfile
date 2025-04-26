FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install netcat-openbsd for MySQL availability check and curl for healthcheck
RUN apt-get update && apt-get install -y netcat-openbsd

# Copy package.json and package-lock.json, then install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files to the working directory
COPY . .

# Make wait-for-it.sh and healthcheck.sh executable
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
COPY healthcheck.sh /usr/src/app/healthcheck.sh
RUN chmod +x /usr/src/app/wait-for-it.sh /usr/src/app/healthcheck.sh

# Expose the application port
EXPOSE 3001

# Start the application, waiting for MySQL to be ready
CMD ["sh", "/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "start"]
