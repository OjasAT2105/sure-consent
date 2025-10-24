<?php
// Simple test to check what's happening with the filter
require_once('../../../wp-config.php');

echo "<h2>Simple Filter Test</h2>";

// Simulate the POST data that would be sent by the frontend
$_POST = array(
    'action' => 'sure_consent_get_consent_logs',
    'nonce' => wp_create_nonce('sure_consent_nonce'),
    'status' => 'accepted',
    'page' => 1,
    'per_page' => 10
);

echo "<h3>Simulated POST Data</h3>";
echo "<pre>" . print_r($_POST, true) . "</pre>";

// Include the necessary files
require_once('admin/class-sure-consent-ajax.php');
require_once('admin/class-sure-consent-storage.php');

// Mock the required functions
if (!function_exists('current_user_can')) {
    function current_user_can($capability) {
        return true; // Simulate admin user
    }
}

if (!function_exists('wp_verify_nonce')) {
    function wp_verify_nonce($nonce, $action) {
        return true; // Always validate for testing
    }
}

if (!function_exists('wp_die')) {
    function wp_die($message) {
        echo "<p>wp_die called with message: $message</p>";
        exit;
    }
}

// Capture the JSON response
ob_start();

// Call the storage method directly
try {
    Sure_Consent_Storage::get_consent_logs();
} catch (Exception $e) {
    echo "<p>Error: " . $e->getMessage() . "</p>";
}

$output = ob_get_clean();

echo "<h3>Output from get_consent_logs()</h3>";
echo "<pre>" . htmlspecialchars($output) . "</pre>";

echo "<p>Test completed.</p>";
?>