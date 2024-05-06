# Use the official Node 18 image as the base image
FROM node:18.16.0 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend app
RUN npm run build

# Stage 2: Use a lightweight Node image for serving the application
FROM node:18.16.0-alpine

# Set a non-root user
RUN addgroup -g 1001 appuser && adduser -D -u 1001 -G appuser appuser

# Set the working directory in the container
WORKDIR /app

# # Copy the built app from the builder stage to the working directory
# COPY --from=builder /app/build ./build

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=appuser:appuser /app .

# Install serve globally to serve the static files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Switch to the non-root user
USER appuser

# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]
