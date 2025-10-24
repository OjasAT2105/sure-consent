<?php
// Load WordPress
require_once('../../../wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    wp_die('Access denied');
}

global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';

// Insert a test consent log with more realistic data
$test_preferences = array(
    'Essential Cookies' => true,
    'Functional Cookies' => true,
    'Analytics Cookies' => false,
    'Marketing Cookies' => false
);

// Generate a test IP address that will show a country
$test_ips = array(
    '192.169.1.100', // United States
    '192.170.5.75',  // United Kingdom
    '192.171.10.200', // Germany
    '192.172.15.50',  // France
    '127.0.0.1'       // Localhost
);

$test_ip = $test_ips[array_rand($test_ips)];

$inserted = $wpdb->insert(
    $table_name,
    array(
        'ip_address' => $test_ip,
        'user_id' => null,
        'preferences' => json_encode($test_preferences),
        'action' => 'partially_accepted',
        'timestamp' => current_time('mysql'),
        'user_agent' => 'Manual Test Insert - ' . $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        'version' => '1.0'
    ),
    array('%s', '%d', '%s', '%s', '%s', '%s', '%s')
);

if ($inserted) {
    echo "<p style='color: green;'>✓ Test consent log inserted successfully!</p>";
    echo "<p>Log ID: " . $wpdb->insert_id . "</p>";
    echo "<p>IP Address: " . $test_ip . "</p>";
} else {
    echo "<p style='color: red;'>✗ Failed to insert test consent log: " . $wpdb->last_error . "</p>";
}

echo "<p><a href='check-table.php'>Check table again</a></p>";
echo "<p><a href='" . admin_url('admin.php?page=sureconsent&tab=analytics&subtab=logs') . "'>View Consent Logs</a></p>";
echo "<p><a href='" . admin_url('admin.php?page=sureconsent') . "'>Back to SureConsent</a></p>";