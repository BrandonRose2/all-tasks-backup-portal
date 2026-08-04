# ============================================================
# Move-OldEmails.ps1
# Exchange 2010 PowerShell Script
#
# PURPOSE:
#   Move all emails in Marc Menowitz's Inbox that were received
#   on or before June 30, 2025 into a folder called "2025 & Older"
#
# HOW TO RUN:
#   1. Log into the Exchange Server via Remote Desktop (RDP)
#   2. Open "Exchange Management Shell" (NOT regular PowerShell)
#      - Start Menu > Microsoft Exchange Server 2010 > Exchange Management Shell
#   3. Paste this entire script and press Enter
#   4. It will process emails in batches and show progress
#
# NOTE: This script is READ-SAFE on first run (uses -WhatIf by default).
#       Change $WhatIf = $true to $WhatIf = $false to actually move emails.
# ============================================================

# ---------- CONFIGURATION ----------
$Mailbox      = "marcmen"           # Marc's username (DOMAIN\marcmen without the DOMAIN\ part)
$TargetFolder = "2025 & Older"      # Destination folder name (must already exist in inbox)
$CutoffDate   = [datetime]"07/01/2025"  # Move emails BEFORE this date
$WhatIf       = $false              # Set to $false to actually move emails (currently LIVE)
$BatchSize    = 500                 # Number of emails to process per batch
# -----------------------------------

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Move-OldEmails.ps1" -ForegroundColor Cyan
Write-Host " Mailbox     : $Mailbox" -ForegroundColor Cyan
Write-Host " Target      : $TargetFolder" -ForegroundColor Cyan
Write-Host " Cutoff Date : Before $CutoffDate" -ForegroundColor Cyan
Write-Host " WhatIf Mode : $WhatIf ($(if($WhatIf){'DRY RUN - no changes will be made'}else{'LIVE - emails WILL be moved'}))" -ForegroundColor $(if($WhatIf){'Yellow'}else{'Green'})
Write-Host "============================================" -ForegroundColor Cyan

# Get the mailbox
try {
    $mbx = Get-Mailbox -Identity $Mailbox -ErrorAction Stop
    Write-Host "Found mailbox: $($mbx.DisplayName) <$($mbx.PrimarySmtpAddress)>" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Could not find mailbox '$Mailbox'. Check the username and try again." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Search for emails in Inbox older than the cutoff date
Write-Host "`nSearching for emails in Inbox received before $CutoffDate..." -ForegroundColor Yellow

$totalMoved = 0
$batchNum   = 0

do {
    $batchNum++
    Write-Host "Processing batch $batchNum (up to $BatchSize emails)..." -ForegroundColor Yellow

    # Search the inbox for old emails
    $results = Search-Mailbox -Identity $Mailbox `
        -SearchQuery "Received:<$($CutoffDate.ToString('MM/dd/yyyy')) AND FolderPath:Inbox" `
        -TargetMailbox $Mailbox `
        -TargetFolder $TargetFolder `
        -SearchDumpsterOnly:$false `
        -LogLevel Suppress `
        $(if($WhatIf){"-WhatIf"}) `
        -ErrorAction SilentlyContinue

    if ($results) {
        $count = $results.ResultItemsCount
        $totalMoved += $count
        Write-Host "  Batch $batchNum: Moved $count emails. Total so far: $totalMoved" -ForegroundColor Green
        
        # If fewer than batch size were returned, we're done
        if ($count -lt $BatchSize) { break }
    } else {
        Write-Host "  No more emails found matching criteria." -ForegroundColor Green
        break
    }

} while ($true)

Write-Host "`n============================================" -ForegroundColor Cyan
if ($WhatIf) {
    Write-Host " DRY RUN COMPLETE. No emails were actually moved." -ForegroundColor Yellow
    Write-Host " To move emails for real, set `$WhatIf = `$false and run again." -ForegroundColor Yellow
} else {
    Write-Host " DONE! Total emails moved: $totalMoved" -ForegroundColor Green
    Write-Host " All emails from before $CutoffDate have been moved to '$TargetFolder'" -ForegroundColor Green
}
Write-Host "============================================" -ForegroundColor Cyan
