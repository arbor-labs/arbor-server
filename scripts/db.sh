#!/bin/sh

set -e

[ -n "$CI" ] || [ -n "$DEVCONTAINER" ] && exit 0          # The DB is managed elsewhere.
[ -f /sys/devices/virtual/dmi/id/product_uuid ] && exit 0 # This is an EC2 instance.

if [ "$(uname)" != "Darwin" ]; then
  echo "WARNING: This script has only been written for macOS. Results may vary on other systems."
fi

command -v pg_ctl > /dev/null || {
  echo "Could not find pg_ctl command. Have you installed postgres?"
  exit 1
}

DIR=$(ls "$HOME/Library/Application Support/Postgres/" 2> /dev/null | sort | tail -n 1)
if [ -z "$DIR" ]; then
  DIR="/usr/local/var/postgres"
else
  DIR="$HOME/Library/Application Support/Postgres/$DIR"
fi

if [ "$1" = "up" ]; then
  # Ignore error messages here since the database might already be running and populated
  {
    pg_ctl -D "$DIR" -o "-p 5432" start
    createuser arboradmin --superuser --createdb --createrole
    createdb arbor
    psql -d arbor -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    psql -d arbor -c 'ALTER USER arboradmin WITH SUPERUSER;'
    psql -d arbor -c "GRANT ALL PRIVILEGES ON DATABASE arbor TO arboradmin;"
    psql -d arbor -c "GRANT ALL ON SCHEMA public TO arboradmin;"
  } > /dev/null 2>&1 || true

  if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "Postgres is running"
  else
    echo "Postgres is not running"
    exit 1
  fi

  if psql -d arbor -c '\dx' | grep -q uuid-ossp; then
    echo "uuid-ossp extension is installed"
  else
    echo "uuid-ossp extension is not installed"
    exit 1
  fi

  if psql -d arbor -c '\dn+' | grep -q arboradmin; then
    echo "arboradmin has all privileges"
  else
    echo "arboradmin does not have all privileges"
    exit 1
  fi

elif [ "$1" = "down" ]; then
  pg_ctl -D "$DIR" -o "-p 5432" stop || true

elif [ "$1" = "clear" ]; then
  echo "This will clear all tables in the arbor database. Are you sure? [y/N]"
  read -r answer
  if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    psql -d arbor -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    psql -d arbor -c "GRANT ALL ON SCHEMA public TO arboradmin;"
    psql -d arbor -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    echo "Database cleared. Run migrations to recreate schema."
  else
    echo "Operation cancelled by user."
  fi

elif [ "$1" = "drop" ]; then
  echo "This will erase the database. Are you sure? [y/N]"
  read -r answer
  if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    pg_isready -h localhost -p 5432 > /dev/null 2>&1 || pg_ctl -D "$DIR" -o "-p 5432" start || true
    if ! dropdb --if-exists arbor || ! dropuser --if-exists arboradmin; then
      echo "Force drop DB? [y/N]"
      read -r answer
      if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        dropdb --force --if-exists arbor
        dropuser --if-exists arboradmin
      else
        echo "User declined to force drop DB."
        exit 0
      fi
    fi
    pg_ctl -D "$DIR" -o "-p 5432" stop || true
    echo "Database dropped. Run 'pnpm db:up' to recreate."
  else
    echo "Operation cancelled by user."
  fi

else
  echo "Usage: $0 up|down|clear|drop"
  exit 1
fi
