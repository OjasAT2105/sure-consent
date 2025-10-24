<?php
// Direct test of the filter functionality
// This bypasses the AJAX handler to test the storage class directly

// Include WordPress
require_once('../../../wp-config.php');

// Include the storage class
require_once('admin/class-sure-consent-storage.php');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Direct Test of Consent Log Filter</h2>";

// Test the storage class directly
if (class_exists('Sure_Consent_Storage')) {
    echo "<p>Sure_Consent_Storage class found</p>";
    
    // Simulate the POST data
    $_POST['status'] = 'accepted';
    $_POST['page'] = 1;
    $_POST['per_page'] = 10;
    $_POST['nonce'] = wp_create_nonce('sure_consent_nonce');
    
    // Mock the required functions
    if (!function_exists('current_user_can')) {
        function current_user_can($capability) {
            return true;
        }
    }
    
    if (!function_exists('wp_verify_nonce')) {
        function wp_verify_nonce($nonce, $action) {
            return true;
        }
    }
    
    // Capture the output
    ob_start();
    
    // Call the method
    try {
        Sure_Consent_Storage::get_consent_logs();
    } catch (Exception $e) {
        echo "<p>Error: " . $e->getMessage() . "</p>";
    }
    
    $output = ob_get_clean();
    
    echo "<h3>Output from get_consent_logs():</h3>";
    echo "<pre>" . htmlspecialchars($output) . "</pre>";
} else {
    echo "<p>Error: Sure_Consent_Storage class not found</p>";
}

echo "<p>Test completed.</p>";
?>