<?php
// Test script to debug filter functionality
require_once('../../../wp-config.php');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Testing Consent Log Filter</h2>";

// Include the necessary files
require_once('admin/class-sure-consent-storage.php');

// Test database connection and data
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';

echo "<h3>Database Records Summary</h3>";
$query = "SELECT action, COUNT(*) as count FROM $table_name GROUP BY action";
$results = $wpdb->get_results($query);

if (!empty($results)) {
    echo "<ul>";
    foreach ($results as $row) {
        echo "<li>Action: {$row->action}, Count: {$row->count}</li>";
    }
    echo "</ul>";
} else {
    echo "<p>No records found in the database</p>";
}

// Test the filtering function directly
echo "<h3>Testing Filter Function</h3>";

// Simulate POST data for testing
$_POST['nonce'] = wp_create_nonce('sure_consent_nonce');
$_POST['status'] = 'accepted';
$_POST['page'] = 1;
$_POST['per_page'] = 10;

// Add required user capabilities for testing
if (!function_exists('current_user_can')) {
    function current_user_can($capability) {
        return true; // Simulate admin user
    }
}

// Add required wp_send_json_success function for testing
if (!function_exists('wp_send_json_success')) {
    function wp_send_json_success($data) {
        echo "<h4>Function would send JSON success response:</h4>";
        echo "<pre>" . print_r($data, true) . "</pre>";
    }
}

if (!function_exists('wp_send_json_error')) {
    function wp_send_json_error($data) {
        echo "<h4>Function would send JSON error response:</h4>";
        echo "<pre>" . print_r($data, true) . "</pre>";
    }
}

// Call the function directly
if (class_exists('Sure_Consent_Storage')) {
    echo "<p>Calling Sure_Consent_Storage::get_consent_logs() with status=accepted</p>";
    Sure_Consent_Storage::get_consent_logs();
} else {
    echo "<p>Error: Sure_Consent_Storage class not found</p>";
}

echo "<p>Test completed.</p>";
?>