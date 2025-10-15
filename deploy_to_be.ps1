#!/usr/bin/env pwsh
#Requires -Version 7

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Set-Location -Path $scriptRoot

npm run build

$distDir = Join-Path $scriptRoot 'dist'
$targetDir = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot '..\rust-be-template\fe'))

if (-not (Test-Path -Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
} else {
    Get-ChildItem -Path $targetDir -Force | ForEach-Object {
        Remove-Item -Path $_.FullName -Recurse -Force
    }
}

$distFullPath = Convert-Path -Path $distDir
$targetFullPath = Convert-Path -Path $targetDir

Get-ChildItem -Path $distDir -Recurse -File | Where-Object {
    $ext = $_.Extension.ToLowerInvariant()
    $ext -ne '.png' -and $ext -ne '.jpg'
} | ForEach-Object {
    $output = "$($_.FullName).zst"
    & zstd --ultra -22 -f -o $output $_.FullName
}

Get-ChildItem -Path $distDir -Recurse -Filter '*.zst' -File | ForEach-Object {
    $relativePath = [System.IO.Path]::GetRelativePath($distFullPath, $_.FullName)
    $destination = Join-Path $targetFullPath $relativePath
    New-Item -ItemType Directory -Path ([System.IO.Path]::GetDirectoryName($destination)) -Force | Out-Null
    Copy-Item -Path $_.FullName -Destination $destination -Force
}

Get-ChildItem -Path $distDir -Recurse -File | Where-Object {
    $ext = $_.Extension.ToLowerInvariant()
    $ext -eq '.png' -or $ext -eq '.jpg'
} | ForEach-Object {
    $relativePath = [System.IO.Path]::GetRelativePath($distFullPath, $_.FullName)
    $destination = Join-Path $targetFullPath $relativePath
    New-Item -ItemType Directory -Path ([System.IO.Path]::GetDirectoryName($destination)) -Force | Out-Null
    Copy-Item -Path $_.FullName -Destination $destination -Force
}
