#!/bin/bash

set -e

echo "Executando migrações do Prisma..."
yarn prisma migrate dev

echo "Executando seeder: genericUser..."
yarn node prisma/seeders/genericUser.js

echo "Executando seeder: generateUserFake..."
yarn node prisma/seeders/generateUserFake.js

echo "Seeders executados com sucesso!"
