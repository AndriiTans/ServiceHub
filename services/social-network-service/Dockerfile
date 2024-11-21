FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files
COPY . .

# Make healthcheck.sh executable
COPY healthcheck.sh /usr/local/bin/healthcheck.sh
RUN chmod +x /usr/local/bin/healthcheck.sh
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD /usr/local/bin/healthcheck.sh

# Build the NestJS application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3004

# Start the application
CMD ["npm", "start"]