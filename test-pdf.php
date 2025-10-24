<?php
// Test PDF generation
require_once('../../../wp-config.php');

// Include the storage class
require_once('admin/class-sure-consent-storage.php');

echo "<h2>PDF Generation Test</h2>";

// Create a mock log object for testing
$mock_log = new stdClass();
$mock_log->id = 123;
$mock_log->timestamp = date('Y-m-d H:i:s');
$mock_log->ip_address = '192.168.1.100';
$mock_log->country = 'United States';
$mock_log->user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
$mock_log->action = 'accepted';
$mock_log->version = '1.0.0';
$mock_log->preferences = json_encode(array(
    'necessary' => true,
    'analytics' => false,
    'marketing' => true
));

echo "<p>Testing PDF generation with mock data...</p>";

// Test the PDF generation
try {
    // This will output the PDF directly
    Sure_Consent_Storage::create_consent_pdf($mock_log);
} catch (Exception $e) {
    echo "<p>Error: " . $e->getMessage() . "</p>";
}

echo "<p>Test completed.</p>";
?>