#!/bin/bash

# Wait for database to be ready
until pg_isready -h db -U postgres
do
  echo "Waiting for database..."
  sleep 2
done

echo "Database is ready!"

npx ts-node-dev --respawn --transpile-only src/server.ts

# Run migrations
npx prisma migrate deploy

# Start the application
npm run start