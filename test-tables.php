<?php
// Test script to check if SureConsent tables exist
require_once('../../../wp-config.php');
require_once('../../../wp-includes/wp-db.php');

global $wpdb;

// Check if the tables exist
$tables = array(
    'sure_consent_logs',
    'sure_consent_scanned_cookies',
    'sure_consent_scan_history',
    'sure_consent_scheduled_scans'
);

echo "Checking SureConsent tables...\n";

foreach ($tables as $table) {
    $full_table_name = $wpdb->prefix . $table;
    $exists = $wpdb->get_var("SHOW TABLES LIKE '$full_table_name'") == $full_table_name;
    echo "$full_table_name: " . ($exists ? "EXISTS" : "MISSING") . "\n";
    
    if ($exists) {
        // Show table structure
        echo "  Structure:\n";
        $columns = $wpdb->get_results("DESCRIBE $full_table_name");
        foreach ($columns as $column) {
            echo "    {$column->Field} ({$column->Type})\n";
        }
    }
}

echo "\nTest completed.\n";