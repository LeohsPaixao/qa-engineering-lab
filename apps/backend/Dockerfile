FROM node:22.19.0-slim AS base

FROM base AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune backend --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/full/ .
RUN yarn install --frozen-lockfile


FROM base AS runner
WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=installer /app/ .

WORKDIR /app/apps/backend
RUN yarn prisma generate

EXPOSE 3001

CMD ["yarn", "start"]