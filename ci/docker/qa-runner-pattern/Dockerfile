FROM node:22.19.0-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV TURBO_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    xvfb \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /github/workspace

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/scripts/package.json ./packages/scripts/
COPY packages/preprocessor/package.json ./packages/preprocessor/
COPY docs/package.json ./docs/
COPY tests/robot/package.json ./tests/robot/
COPY tests/restAssured/package.json ./tests/restAssured/
COPY tests/performance/package.json ./tests/performance/
COPY tests/cypress/package.json ./tests/cypress/
COPY tests/playwright/package.json ./tests/playwright/
COPY tests/selenium/package.json ./tests/selenium/

RUN yarn install --frozen-lockfile && yarn cache clean

CMD ["bash"]