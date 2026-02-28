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
    gnupg \
    libgbm1 \
    xdg-utils \
    && wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb || true \
    && apt-get update \
    && apt-get install -y -f \
    && rm google-chrome-stable_current_amd64.deb \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn --force

CMD ["bash"]