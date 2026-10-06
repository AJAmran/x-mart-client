# ── Build stage ──────────────────────────────────────────────────────────────
# `output: "standalone"` in next.config.js produces a server bundle with only
# the node_modules actually imported, which is what keeps the runtime image at
# a few hundred MB instead of over a gigabyte.
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY next.config.js ./
COPY tsconfig.json ./
COPY .eslintrc.json ./
COPY public ./public
COPY src ./src

# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so
# they must be supplied as build args — setting them later at runtime has no
# effect on the JavaScript that already shipped.
ARG NEXT_PUBLIC_BASE_API
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_IMAGE_HOSTS
ENV NEXT_PUBLIC_BASE_API=$NEXT_PUBLIC_BASE_API \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_IMAGE_HOSTS=$NEXT_PUBLIC_IMAGE_HOSTS

RUN npm run build


# ── Runtime stage ────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# `.next/standalone` already contains a pruned node_modules with only what the
# server imports, so it is copied whole rather than reinstalling dependencies.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# The node image ships an unprivileged `node` user (uid 1000). Running the app
# as root would mean a container escape starts with full host privileges.
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]