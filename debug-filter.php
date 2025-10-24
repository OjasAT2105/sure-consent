<?php
// Debug script to test filter functionality
require_once('../../../wp-config.php');

// Simulate a POST request to test the filter
$_POST = array(
    'action' => 'sure_consent_get_consent_logs',
    'nonce' => wp_create_nonce('sure_consent_nonce'),
    'status' => 'accepted',
    'page' => 1,
    'per_page' => 10
);

// Include the necessary files
require_once('admin/class-sure-consent-ajax.php');
require_once('admin/class-sure-consent-storage.php');

// Call the function directly
echo "<h2>Testing Consent Log Filter</h2>";
echo "<p>Simulating filter request with status: accepted</p>";

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Call the function
if (class_exists('Sure_Consent_Storage')) {
    echo "<p>Storage class exists, calling get_consent_logs()</p>";
    // We can't directly call the method because it uses wp_send_json_success
    // So let's just check the database directly
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'sure_consent_logs';
    
    echo "<h3>Database Query Test</h3>";
    $query = "SELECT * FROM $table_name WHERE (action = 'accepted' OR action = 'accept_all') ORDER BY timestamp DESC LIMIT 5";
    echo "<p>Query: $query</p>";
    
    $results = $wpdb->get_results($query);
    echo "<p>Found " . count($results) . " records</p>";
    
    if (!empty($results)) {
        echo "<ul>";
        foreach ($results as $row) {
            echo "<li>ID: {$row->id}, Action: {$row->action}, Timestamp: {$row->timestamp}</li>";
        }
        echo "</ul>";
    }
} else {
    echo "<p>Storage class not found</p>";
}

echo "<p>Test completed.</p>";
?>