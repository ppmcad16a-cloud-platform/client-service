# ============================================================
# Client (React SPA) - container image
#
# Multi-stage build:
#   1. "build"   compiles the React app with webpack -> /app/dist
#   2. "runtime" serves the static files with nginx (non-root)
#
# API_URL is baked into the JavaScript at build time. The default
# "/api" is RELATIVE: the browser calls the same domain that served
# the page, and the Kubernetes Gateway routes /api to the API
# gateway. That way ONE image works in AWS, Azure and GCP.
# (docker compose overrides it with http://localhost:3000/api.)
# ============================================================

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# --ignore-scripts: never run third-party install scripts at build time
RUN npm ci --ignore-scripts

COPY . .

ARG API_URL=/api
ENV API_URL=${API_URL}
RUN npm run build


FROM nginxinc/nginx-unprivileged:1.30-alpine AS runtime

# Pull in Alpine security fixes released after the base image was built
# (the Trivy gate fails the build on fixable HIGH/CRITICAL findings).
USER root
RUN apk upgrade --no-cache
# Back to the image's unprivileged "nginx" user (uid 101).
USER 101

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
