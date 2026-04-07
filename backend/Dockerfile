# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
# Copy only package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the backend source code
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
# Install only production dependencies to keep the image lightweight
RUN npm ci --only=production

# Copy compiled JavaScript from builder stage
COPY --from=builder /app/dist ./dist

# Ensure the app binds to the port provided by Cloud Run
ENV PORT=8000
EXPOSE 8000

CMD ["node", "dist/server.js"]
