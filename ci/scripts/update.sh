#!/bin/bash

echo "🚀 Atualizando containers locais..."

CONTAINERS=$(docker ps -a --filter "name=qa-engineering-lab" --format "{{.ID}}")

if [ ! -z "$CONTAINERS" ]; then
    echo "🛑 Parando e removendo containers existentes..."
    docker stop $CONTAINERS
    docker rm $CONTAINERS
fi

docker rmi qa-engineering-lab-backend
docker rmi qa-engineering-lab-frontend
docker-compose build
docker-compose up -d --force-recreate

echo "✅ Containers atualizados!"
