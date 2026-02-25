#!/bin/bash

echo "🚀 Iniciando limpeza do act..."

# 1. Parar e remover containers que começam com 'act-'
CONTAINERS=$(docker ps -a --filter "name=act-" --format "{{.ID}}")

if [ ! -z "$CONTAINERS" ]; then
    echo "🛑 Removendo containers órfãos do act..."
    docker stop $CONTAINERS > /dev/null 2>&1
    docker rm -f $CONTAINERS > /dev/null 2>&1
    echo "✅ Containers removidos!"
fi

# 2. Remover networks que começam com 'act-'
NETWORKS=$(docker network ls --filter "name=act-" --format "{{.ID}}")

if [ ! -z "$NETWORKS" ]; then
    echo "🛑 Removendo networks do act..."
    # Tenta remover as networks. O || true serve para não fechar o script com erro caso alguma falhe
    docker network rm $NETWORKS > /dev/null 2>&1 || true
    echo "✅ Networks do act processadas!"
else
    echo "✅ Nenhuma network do act encontrada."
fi
