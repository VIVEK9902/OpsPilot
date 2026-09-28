Get-Content .env | ForEach-Object {
    if (-not [string]::IsNullOrWhiteSpace($_) -and -not $_.StartsWith('#')) {
        $parts = $_ -split '=', 2
        if ($parts.Length -eq 2) {
            $name = $parts[0].Trim()
            $value = $parts[1].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, [EnvironmentVariableTarget]::Process)
        }
    }
}
java -jar target\opspilot-0.0.1-SNAPSHOT.jar
