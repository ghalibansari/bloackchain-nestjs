################ BASE STAGE ################
# Start with Node.js 22 as our base image
FROM node:22 AS base

# Set up pnpm package manager environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install OpenSSL and required dependencies
RUN apt-get update -y && apt-get install -y openssl

# Copy application code and set working directory
COPY . /app
WORKDIR /app

################ PRODUCTION DEPENDENCIES STAGE ################
# Production dependencies stage
FROM base AS prod-deps
# Install production dependencies using cache mount for better performance
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Generate Prisma Client for database operations
RUN pnpx prisma generate

################ BUILD STAGE ################
# Build stage for compiling TypeScript code
FROM base AS build
# Install all dependencies including devDependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpx prisma generate
RUN pnpm run build

################ FINAL STAGE ################
# Final stage that will be deployed
FROM base
# Copy production dependencies from prod-deps stage
COPY --from=prod-deps /app/node_modules /app/node_modules
# Copy compiled code from build stage
COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=build /app/dist /app/dist


# Copy Prisma schema and generated client for database access
# COPY prisma /app/prisma
# COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma

# Generate Prisma Client in the final stage for database connectivity
# RUN pnpm install --prod --frozen-lockfile
# RUN pnpx prisma generate

# Expose port 3000 for the application
EXPOSE 3000
# Start the production server
CMD [ "pnpm", "start:prod" ]