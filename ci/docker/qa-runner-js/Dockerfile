FROM node:22-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Dependências para Playwright, Cypress, Newman e ferramentas do SO
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    wget \
    xvfb \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# Atualiza npm e instala CLI globais
RUN npm install -g npm@latest newman @playwright/test@latest

# Instala os navegadores do Playwright
RUN npx playwright install --with-deps --only-shell

CMD ["bash"]