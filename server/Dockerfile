# Stage 1: Build the app with pnpm
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml, and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy the Strapi project files
COPY . .

# Build the project (if using TypeScript or for production build)
RUN pnpm build

# Stage 2: Production Image (small final image)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally in the production image
RUN npm install -g pnpm

# Copy only the necessary files (from build stage)
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/

# Install only the production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy the built Strapi app from the previous stage
COPY --from=build /app .

# Expose the Strapi default port
EXPOSE 1337

# Start Strapi
CMD ["pnpm", "start"]
