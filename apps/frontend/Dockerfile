FROM node:22.19.0-alpine AS base

WORKDIR /app

FROM base AS builder

RUN yarn global add turbo
COPY . .
RUN turbo prune frontend --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/full/ .
RUN yarn install --frozen-lockfile

FROM base AS runner
WORKDIR /app
COPY --from=installer /app/ .

WORKDIR /app/apps/frontend

EXPOSE 8181

CMD ["yarn", "start"]