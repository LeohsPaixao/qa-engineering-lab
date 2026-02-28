FROM gradle:9.3.0-jdk21

ENV DEBIAN_FRONTEND=noninteractive

USER root

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
    libxtst6 \
    fonts-liberation \
    chromium-browser \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

RUN npm install -g yarn --force

WORKDIR /workspace

CMD ["bash"]