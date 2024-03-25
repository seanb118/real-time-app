# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app
# Optionally clear the npm cache


# Copy the current directory contents into the container
COPY . /app

# Change to the frontend directory, install Node.js packages, and build the frontend
WORKDIR /app/real-time-chat-frontend
COPY public public
COPY src src
RUN npm cache clean --force
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm run build

# Make port 80 available to the world outside this container
EXPOSE 3000

# Run app.py when the container launches
CMD ["python", "../real-time-chat-backend-flask/app.py"]
