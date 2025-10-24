<?php
/**
 * Test script to verify consent logs are being saved
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    wp_die('Access denied');
}

global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';

// Get the latest 10 consent logs
$logs = $wpdb->get_results("SELECT * FROM $table_name ORDER BY timestamp DESC LIMIT 10");

echo "<h2>SureConsent - Latest Consent Logs</h2>";
echo "<p>Total logs in database: " . $wpdb->get_var("SELECT COUNT(*) FROM $table_name") . "</p>";

if (empty($logs)) {
    echo "<p>No consent logs found.</p>";
} else {
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>ID</th><th>IP Address</th><th>User ID</th><th>Action</th><th>Timestamp</th><th>Preferences</th></tr>";
    
    foreach ($logs as $log) {
        echo "<tr>";
        echo "<td>" . esc_html($log->id) . "</td>";
        echo "<td>" . esc_html($log->ip_address) . "</td>";
        echo "<td>" . esc_html($log->user_id ?? 'N/A') . "</td>";
        echo "<td>" . esc_html($log->action) . "</td>";
        echo "<td>" . esc_html($log->timestamp) . "</td>";
        echo "<td>" . esc_html($log->preferences) . "</td>";
        echo "</tr>";
    }
    
    echo "</table>";
}

// Test saving a consent log
if (isset($_GET['test_save'])) {
    $test_data = array(
        'essential' => true,
        'analytics' => true,
        'marketing' => false
    );
    
    $inserted = $wpdb->insert(
        $table_name,
        array(
            'ip_address' => '127.0.0.1',
            'user_id' => null,
            'preferences' => json_encode($test_data),
            'action' => 'test_action',
            'timestamp' => current_time('mysql'),
            'user_agent' => 'Test Script',
            'version' => '1.0'
        ),
        array('%s', '%d', '%s', '%s', '%s', '%s', '%s')
    );
    
    if ($inserted) {
        echo "<p>Test consent log saved successfully!</p>";
    } else {
        echo "<p>Failed to save test consent log: " . $wpdb->last_error . "</p>";
    }
    
    // Refresh the page to show the new log
    echo "<script>setTimeout(function(){ window.location.href = window.location.pathname; }, 2000);</script>";
}

echo "<p><a href='?test_save=1'>Save Test Consent Log</a></p>";