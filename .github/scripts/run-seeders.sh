#!/bin/bash

set -e

echo "Navegando para o diretório backend..."
cd apps/backend || { echo "Falha ao acessar o diretório backend"; exit 1; }

echo "Executando migrações do Prisma..."
yarn prisma migrate dev

echo "Executando seeder: generateUserFake..."
yarn tsx prisma/seeders/generateUserFake.ts

echo "Executando seeder: genericUser..."
yarn tsx prisma/seeders/genericUser.ts

echo "Seeders executados com sucesso!"
