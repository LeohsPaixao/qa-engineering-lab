FROM gradle:8.8-jdk21

ENV DEBIAN_FRONTEND=noninteractive

USER root

RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    xvfb \
    libxi6 \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    fonts-liberation \
    chromium-browser \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

CMD ["bash"]