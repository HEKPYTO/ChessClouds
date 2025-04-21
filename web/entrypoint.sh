#!/bin/sh
set -e

echo "Starting environment variable replacement process..."

printenv | grep NEXT_PUBLIC_ | while read -r line ; do
  key=$(echo $line | cut -d "=" -f1)
  value=$(echo $line | cut -d "=" -f2-)
  
  echo "Replacing $key with its actual value..."
  find /app/.next \( -type d -name .git -prune \) -o -type f -exec sed -i "s|$key|$value|g" {} \;
done

echo "Environment variable replacement completed."

exec "$@"