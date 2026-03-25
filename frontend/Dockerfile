FROM node:20-slim

# Install build essentials and networking tools
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    net-tools \
    iputils-ping \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application using npx to ensure binaries are found
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application using npx serve
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
