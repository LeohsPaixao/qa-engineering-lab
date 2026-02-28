#!/bin/sh

echo "Esperando banco em $DATABASE_HOST:$DATABASE_PORT..."

until nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done

echo "Banco disponível. Iniciando backend..."

exec "$@"