$ErrorActionPreference = "Stop"

Write-Host "==> Build project"
dotnet build

Write-Host "==> Tao migration InitialCreate neu chua ton tai"
$migrationExists = dotnet ef migrations list 2>$null | Select-String -Pattern "InitialCreate"
if (-not $migrationExists) {
    dotnet ef migrations add InitialCreate
}

Write-Host "==> Cap nhat database"
dotnet ef database update

Write-Host "==> Chay ung dung"
dotnet run
