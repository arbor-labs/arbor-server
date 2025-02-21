#!/bin/sh

set -e

cat << EOF
WARNING: TypeORM migrations are generated relative to your current DB
state, not relative to what the migrations directory already has. Please
make sure your DB is in the same state as the latest migration. Otherwise
write the migration manually.
EOF

printf 'Enter migration name: '
read -r NAME
typeorm -d ./dist/db/migration_config/datasource.js migration:generate "db/migrations/$NAME"
echo 'Migration created'
