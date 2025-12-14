#!/bin/sh

until pg_isready -h ${DB_HOST:-moeda-estudantil-db} -p ${DB_PORT:-5432} > /dev/null 2>&1; do
  sleep 2
done

npx prisma migrate deploy
npm run start
