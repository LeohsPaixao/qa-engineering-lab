FROM node:22.19.0-slim

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

WORKDIR /app

COPY package.json yarn.lock ./

# Apps
COPY apps/backend/package.json ./apps/backend/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/frontend/package.json ./apps/frontend/

# Scripts
COPY packages/scripts/package.json ./packages/scripts/

# Preprocessor
COPY packages/preprocessor/package.json ./packages/preprocessor/
COPY packages/preprocessor/tsconfig.build.json ./packages/preprocessor/
COPY packages/preprocessor/tsconfig.json ./packages/preprocessor/
COPY packages/preprocessor/src ./packages/preprocessor/src

# Docs
COPY docs/package.json ./docs/

# Tests
COPY tests/robot/package.json ./tests/robot/
COPY tests/restAssured/package.json ./tests/restAssured/
COPY tests/performance/package.json ./tests/performance/
COPY tests/cypress/package.json ./tests/cypress/
COPY tests/playwright/package.json ./tests/playwright/
COPY tests/selenium/package.json ./tests/selenium/

RUN yarn install --frozen-lockfile && yarn cache clean

CMD ["bash"]