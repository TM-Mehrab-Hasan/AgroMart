# PowerShell API Testing Script for AgroMart
Write-Host "🚀 Starting AgroMart API Tests..." -ForegroundColor Green

$baseUrl = "http://localhost:3000"
$testResults = @()

# Test cases
$testCases = @(
    @{ Method = "GET"; Endpoint = "/api/products"; Expected = 200; Description = "List products" },
    @{ Method = "GET"; Endpoint = "/api/shops"; Expected = 200; Description = "List shops" },
    @{ Method = "GET"; Endpoint = "/api/reviews"; Expected = 200; Description = "List reviews" },
    @{ Method = "GET"; Endpoint = "/api/cart"; Expected = 401; Description = "Cart (auth required)" }
)

foreach ($test in $testCases) {
    try {
        $url = "$baseUrl$($test.Endpoint)"
        $response = Invoke-WebRequest -Uri $url -Method $test.Method -UseBasicParsing -ErrorAction Stop
        
        $passed = $response.StatusCode -eq $test.Expected
        $status = if ($passed) { "✅ PASS" } else { "❌ FAIL" }
        
        Write-Host "$status $($test.Method) $($test.Endpoint) - Expected: $($test.Expected), Got: $($response.StatusCode)"
        
    } catch {
        Write-Host "❌ ERROR $($test.Method) $($test.Endpoint) - $($_.Exception.Message)"
    }
}