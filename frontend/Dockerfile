FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build

EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]
