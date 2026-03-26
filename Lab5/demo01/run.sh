#!/usr/bin/env bash
set -e

echo "==> Build project"
dotnet build

echo "==> Tao migration InitialCreate neu chua ton tai"
if ! dotnet ef migrations list 2>/dev/null | grep -q "InitialCreate"; then
  dotnet ef migrations add InitialCreate
fi

echo "==> Cap nhat database"
dotnet ef database update

echo "==> Chay ung dung"
dotnet run
