# PowerShell API Testing Script for AgroMart
# Quick verification of critical API endpoints

Write-Host "🚀 Starting AgroMart API Tests..." -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:3000"
$testResults = @()

# Test cases
$testCases = @(
    @{ Method = "GET"; Endpoint = "/api/products"; Expected = 200; Description = "List products" },
    @{ Method = "GET"; Endpoint = "/api/products/featured"; Expected = 200; Description = "Featured products" },
    @{ Method = "GET"; Endpoint = "/api/shops"; Expected = 200; Description = "List shops" },
    @{ Method = "GET"; Endpoint = "/api/reviews"; Expected = 200; Description = "List reviews" },
    @{ Method = "GET"; Endpoint = "/api/cart"; Expected = 401; Description = "Cart (auth required)" },
    @{ Method = "GET"; Endpoint = "/api/orders"; Expected = 401; Description = "Orders (auth required)" }
)

foreach ($test in $testCases) {
    try {
        $url = "$baseUrl$($test.Endpoint)"
        $startTime = Get-Date
        
        $response = Invoke-WebRequest -Uri $url -Method $test.Method -UseBasicParsing -ErrorAction Stop
        
        $endTime = Get-Date
        $responseTime = ($endTime - $startTime).TotalMilliseconds
        
        $passed = $response.StatusCode -eq $test.Expected
        $status = if ($passed) { "✅ PASS" } else { "❌ FAIL" }
        
        Write-Host "$status $($test.Method) $($test.Endpoint) - $($test.Description)" -ForegroundColor $(if ($passed) { "Green" } else { "Red" })
        Write-Host "   Expected: $($test.Expected), Got: $($response.StatusCode), Time: $([math]::Round($responseTime, 2))ms" -ForegroundColor Gray
        Write-Host ""
        
        $testResults += @{
            Test = "$($test.Method) $($test.Endpoint)"
            Expected = $test.Expected
            Actual = $response.StatusCode
            Passed = $passed
            ResponseTime = $responseTime
        }
        
    } catch {
        $status = "❌ ERROR"
        Write-Host "$status $($test.Method) $($test.Endpoint) - $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        
        $testResults += @{
            Test = "$($test.Method) $($test.Endpoint)"
            Expected = $test.Expected
            Actual = "ERROR"
            Passed = $false
            ResponseTime = 0
            Error = $_.Exception.Message
        }
    }
}

# Summary
$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Passed -eq $true }).Count
$failedTests = $totalTests - $passedTests
$successRate = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 1) } else { 0 }

Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests"
Write-Host "✅ Passed: $passedTests" -ForegroundColor Green
Write-Host "❌ Failed: $failedTests" -ForegroundColor Red
Write-Host "🎯 Success Rate: $successRate%"
Write-Host "========================================" -ForegroundColor Cyan

if ($failedTests -gt 0) {
    Write-Host ""
    Write-Host "❌ FAILED TESTS:" -ForegroundColor Red
    $testResults | Where-Object { $_.Passed -eq $false } | ForEach-Object {
        Write-Host "- $($_.Test): Expected $($_.Expected), got $($_.Actual)" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "  Error: $($_.Error)" -ForegroundColor Red
        }
    }
}