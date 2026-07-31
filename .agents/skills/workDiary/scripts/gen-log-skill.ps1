# Generate work-log for the last N days (default 5)
# Usage : & .\gen-log-skill.ps1
# Options:
#   -Days 14     change the look-back window (default 5)
#   -Numbered    output as an ordered list (1. 2. 3.) for a DingTalk report field
#   -Clipboard   copy the result to the clipboard (paste into the report draft)

param(
    [int]$Days = 5,
    [switch]$Numbered,
    [switch]$Clipboard
)

# Calculate date range automatically
$endDate = Get-Date -Format "yyyy-MM-dd"
$startDate = (Get-Date).AddDays(-$Days) | Get-Date -Format "yyyy-MM-dd"

# Current git user name
$author = git config user.name

# Extract this user's commit messages within the range on branch 157_test
$logs = @(git log 157_test --author="$author" `
    --since="$startDate 00:00:00" `
    --until="$endDate 23:59:59" `
    --pretty=format:"%s")

# Strip conventional-commit prefixes. \p{P} matches any punctuation so both
# half-width (:) and full-width (：) colons are covered without putting a
# non-ASCII char in this script. "pref" tolerates the common "perf" typo.
$pattern = "(?i)^(feat|fix|style|perf|pref|refactor|revert|test|docs|chore|workflow|ci|types|wip)\s*\p{P}\s*"

# Clean: drop merge commits, strip prefixes, drop trailing punctuation, trim, drop empties
$items = @(
    $logs |
        Where-Object { $_ -notmatch "^Merge branch" } |
        ForEach-Object { (($_ -replace $pattern, "") -replace "\s*\p{P}+\s*$", "").Trim() } |
        Where-Object { $_ -ne "" }
)

# Build output: ordered list when -Numbered, otherwise plain lines
if ($Numbered) {
    $i = 0
    $lines = $items | ForEach-Object { $i++; "$i. $_" }
} else {
    $lines = $items
}
$output = $lines -join "`n"

# Optionally copy to clipboard for pasting into the DingTalk report draft
if ($Clipboard) {
    Set-Clipboard -Value $output
    Write-Host "[copied to clipboard - paste into the DingTalk report draft]"
}

$output
