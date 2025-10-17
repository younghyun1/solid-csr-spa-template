# Requires PowerShell 7+
npm run build
Remove-Item ../rust-be-template/fe/* -Recurse -Force

# Gzip all files in ./dist except .png and .jpg
Get-ChildItem -Path ./dist -Recurse -File | Where-Object { $_.Extension -notin '.png', '.jpg' } | ForEach-Object {
    $inputFile = $_.FullName
    $gzipFile = "$inputFile.gz"
    $inputStream = [System.IO.File]::OpenRead($inputFile)
    $gzipStream = [System.IO.File]::Create($gzipFile)
    $gzipWrapper = New-Object System.IO.Compression.GzipStream($gzipStream, [System.IO.Compression.CompressionLevel]::Optimal)
    $inputStream.CopyTo($gzipWrapper)
    $gzipWrapper.Close()
    $inputStream.Close()
    $gzipStream.Close()
}

Set-Location ./dist

# Copy gzip'd files
Get-ChildItem -Recurse -Filter *.gz | ForEach-Object {
    $relPath = $_.FullName.Substring((Get-Location).Path.Length).TrimStart('\','/')
    $destDir = Join-Path -Path "..\..\rust-be-template\fe" -ChildPath (Split-Path $relPath)
    if (!(Test-Path $destDir)) { New-Item -Path $destDir -ItemType Directory -Force | Out-Null }
    Copy-Item $_.FullName -Destination (Join-Path $destDir $_.Name) -Force
}

# Copy original .png and .jpg files as-is
Get-ChildItem -Recurse -Include *.png,*.jpg | ForEach-Object {
    $relPath = $_.FullName.Substring((Get-Location).Path.Length).TrimStart('\','/')
    $destDir = Join-Path -Path "..\..\rust-be-template\fe" -ChildPath (Split-Path $relPath)
    if (!(Test-Path $destDir)) { New-Item -Path $destDir -ItemType Directory -Force | Out-Null }
    Copy-Item $_.FullName -Destination (Join-Path $destDir $_.Name) -Force
}

Set-Location ..
