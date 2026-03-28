# PowerShell script to automate build, EF Core migrations, database update, and app run.

$ErrorActionPreference = "Stop"

Write-Host "Building project..."
dotnet build

if (Test-Path ".\Migrations\*InitialDemo02*.cs")
{
    Write-Host "Migration InitialDemo02 already exists. Skipping creation."
}
else
{
    Write-Host "Creating EF Core migration InitialDemo02..."
    dotnet ef migrations add InitialDemo02
}

Write-Host "Updating database..."
dotnet ef database update

Write-Host "Running application..."
dotnet run
