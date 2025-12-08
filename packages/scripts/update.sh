#!/bin/bash

echo "🚀 Atualizando containers locais..."

# Identifica os containers do projeto qa-solar em execução
CONTAINERS=$(docker ps -a --filter "name=qa-solar" --format "{{.ID}}")

# Para e remove os containers se existirem
if [ ! -z "$CONTAINERS" ]; then
    echo "🛑 Parando e removendo containers existentes..."
    docker stop $CONTAINERS
    docker rm $CONTAINERS
fi

# Remove as imagens
docker rmi qa-solar-backend
docker rmi qa-solar-frontend

# Reconstroi e inicia os containers
docker-compose build
docker-compose up -d --force-recreate

echo "✅ Containers atualizados!"
