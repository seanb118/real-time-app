# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm cache clean --force
RUN npm install

# Copy the remaining files needed for the build
COPY . .

# Build the frontend
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Install serve and serve the static files
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]