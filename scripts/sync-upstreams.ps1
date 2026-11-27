#requires -Version 5.1
<#
.SYNOPSIS
  Sparse-fetch pinned upstream skills into a cache outside git and Grok scan paths, then print SKILL.md diffs.
.NOTES
  Writes nothing into this repository. Default cache: $env:LOCALAPPDATA\agentic-harness-cache
#>
param(
    [string]$CacheDir = (Join-Path $env:LOCALAPPDATA 'agentic-harness-cache'),
    [string]$SourcesPath = (Join-Path $PSScriptRoot '..\upstream\sources.json')
)

$ErrorActionPreference = 'Stop'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'git is not on PATH'
}

$doc = Get-Content -Raw -Encoding UTF8 -Path $SourcesPath | ConvertFrom-Json
New-Item -ItemType Directory -Force -Path $CacheDir | Out-Null
Write-Output "CACHE $CacheDir"

foreach ($source in $doc.sources) {
    $folder = Join-Path $CacheDir ($source.repository -replace '/', '__')
    $sha = [string]$source.last_synced_sha
    $parents = @($source.skills | ForEach-Object {
            $p = [string]$_.path
            $i = $p.LastIndexOf('/')
            if ($i -lt 0) { '.' } else { $p.Substring(0, $i) }
        } | Select-Object -Unique)

    if (-not (Test-Path (Join-Path $folder '.git'))) {
        & git clone --filter=blob:none --sparse $source.git $folder
        if ($LASTEXITCODE -ne 0) { throw "clone failed: $($source.repository)" }
    }

    & git -C $folder sparse-checkout set -- @parents
    if ($LASTEXITCODE -ne 0) { throw "sparse-checkout failed: $($source.repository)" }

    & git -C $folder fetch --depth 1 origin $sha
    if ($LASTEXITCODE -ne 0) { throw "fetch failed: $($source.repository) $sha" }

    Write-Output "===== $($source.repository) cache vs $sha ====="
    foreach ($skill in $source.skills) {
        $path = [string]$skill.path
        Write-Output "----- $path -> $($skill.maps_to) -----"
        & git -C $folder diff "$sha" -- $path
        if ($LASTEXITCODE -ne 0) { throw "diff failed: $path" }
    }
}
