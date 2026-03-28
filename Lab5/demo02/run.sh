#!/usr/bin/env bash
# chmod +x run.sh
# Script tu dong build, tao migration, update database va chay ung dung.

set -e

echo "Building project..."
dotnet build

if ls ./Migrations/*InitialDemo02*.cs >/dev/null 2>&1; then
  echo "Migration InitialDemo02 already exists. Skipping creation."
else
  echo "Creating EF Core migration InitialDemo02..."
  dotnet ef migrations add InitialDemo02
fi

echo "Updating database..."
dotnet ef database update

echo "Running application..."
dotnet run
