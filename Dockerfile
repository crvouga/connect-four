# Build stage for client
FROM node:18-alpine AS client-builder

WORKDIR /app/client

# Copy client package files
COPY client/package.json client/yarn.lock ./

# Install client dependencies
RUN yarn install --frozen-lockfile

# Copy client source
COPY client/ ./

# Build client
RUN yarn build

# Production stage
FROM node:18-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copy server package files
COPY server/package.json server/yarn.lock ./

# Install server dependencies
RUN yarn install --frozen-lockfile --production

# Copy server source
COPY server/ ./

# Copy built client from builder stage to /client/dist (relative to /app)
COPY --from=client-builder /app/client/dist/ /client/dist/

# Expose port 80
EXPOSE 80

# Set PORT environment variable
ENV PORT=80
ENV NODE_ENV=production

# Start the server
CMD ["node", "app.js"]
