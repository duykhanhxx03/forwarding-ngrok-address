# Start ngrok with tcp 3389 in the background
Start-Process ngrok -ArgumentList "tcp 3389" -PassThru

# Wait for ngrok to start
Start-Sleep -Seconds 5

# Get information about tunnels from the ngrok API
$ngrokApiUrl = "http://127.0.0.1:4040/api/tunnels"
$response = Invoke-RestMethod -Uri $ngrokApiUrl

# Get the forwarding address from the response
$forwardingAddress = $response.tunnels[0].public_url

# Display the forwarding address
Write-Host "Forwarding address: $forwardingAddress"

# The URL of your Node.js server's API
$nodeServerUrl = "http://localhost:3000/api/forwarding"

# Data to send (can include additional fields as needed)
$data = @{
    "forwardingAddress" = $forwardingAddress
}

# Send the HTTP POST request to the Node.js server's API
try {
    $responseApi = Invoke-RestMethod -Uri $nodeServerUrl -Method Post -Body ($data | ConvertTo-Json) -ContentType "application/json"

    if ($responseApi.message -eq "Forwarding information has been successfully stored.") {
        Write-Host "Data has been successfully sent to the Node.js server."
    } else {
        Write-Host "Unable to send data to the Node.js server. Error: $($responseApi.message)"
    }
} catch {
    Write-Host "An error occurred when sending the request to the Node.js server. Error: $($_.Exception.Message)"
}
