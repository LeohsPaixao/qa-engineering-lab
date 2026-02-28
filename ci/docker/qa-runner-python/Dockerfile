FROM python:3.12-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    xvfb \
    make \
    gcc \
    g++ \
    libxi6 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    libgtk-3-0 \
    libgbm1 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

RUN npm install -g yarn --force

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --upgrade pip

RUN pip install \
    robotframework==7.1.1 \
    robotframework-browser==19.0.1 \
    pytest

RUN rfbrowser init

CMD ["bash"]