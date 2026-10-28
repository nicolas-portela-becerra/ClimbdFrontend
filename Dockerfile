# syntax=docker/dockerfile:1

# Build stage
FROM node:24-alpine AS build

# openapi-generator-cli runs a Java JAR: a JRE is required at build time
RUN apk add --no-cache openjdk21-jre-headless

WORKDIR /app
COPY package.json package-lock.json openapitools.json ./
RUN npm ci --ignore-scripts

# Download the generator JAR now: this layer stays cached until the dependencies change
RUN npx openapi-generator-cli version

COPY . .

# Regenerate the API client from openapi.yml from scratch (nothing generated earlier is reused)
RUN rm -rf src/api/generated && npm run generate:api

RUN npm run build

# Runtime stage: static files only
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
