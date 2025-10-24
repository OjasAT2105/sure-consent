<?php
// Test script to verify filter functionality
require_once('../../../wp-config.php');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Filter Verification Test</h2>";

// Include the storage class
require_once('admin/class-sure-consent-storage.php');

// Test different filter scenarios
$test_scenarios = array(
    array('status' => 'all', 'description' => 'All statuses'),
    array('status' => 'accepted', 'description' => 'Accepted status'),
    array('status' => 'decline_all', 'description' => 'Decline All status'),
    array('status' => 'partially_accepted', 'description' => 'Partially Accepted status')
);

global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';

echo "<h3>Database Records Summary</h3>";
$action_counts = $wpdb->get_results("SELECT action, COUNT(*) as count FROM $table_name GROUP BY action");
if (!empty($action_counts)) {
    echo "<ul>";
    foreach ($action_counts as $row) {
        echo "<li>Action: {$row->action}, Count: {$row->count}</li>";
    }
    echo "</ul>";
}

foreach ($test_scenarios as $scenario) {
    echo "<h3>Testing: {$scenario['description']}</h3>";
    
    // Simulate the POST data
    $_POST['status'] = $scenario['status'];
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
    
    if (!function_exists('wp_die')) {
        function wp_die($message) {
            echo "<p>wp_die: $message</p>";
            return;
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
    
    echo "<p>Output captured (check error log for details)</p>";
}

echo "<p>Test completed. Check error logs for detailed information.</p>";
?>