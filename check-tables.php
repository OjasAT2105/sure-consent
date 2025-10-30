<?php
// Check if tables exist
require_once('../../../wp-config.php');
require_once('../../../wp-admin/includes/upgrade.php');

global $wpdb;

$tables = array(
    'consent_logs' => $wpdb->prefix . 'sure_consent_logs',
    'scanned_cookies' => $wpdb->prefix . 'sure_consent_scanned_cookies',
    'scan_history' => $wpdb->prefix . 'sure_consent_scan_history',
    'scheduled_scans' => $wpdb->prefix . 'sure_consent_scheduled_scans'
);

echo "<h2>SureConsent Table Status</h2>";
echo "<pre>";

foreach ($tables as $name => $table_name) {
    $exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'");
    if ($exists) {
        $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        echo "$name table ($table_name): EXISTS ({$count} records)\n";
        
        // Show table structure for scan history
        if ($name === 'scan_history') {
            echo "  Structure:\n";
            $columns = $wpdb->get_results("SHOW COLUMNS FROM $table_name");
            foreach ($columns as $column) {
                echo "    {$column->Field} ({$column->Type})\n";
            }
            
            // Show sample data
            $sample = $wpdb->get_results("SELECT * FROM $table_name LIMIT 3");
            echo "  Sample records:\n";
            foreach ($sample as $record) {
                echo "    ID: {$record->id}, Date: {$record->scan_date}, Cookies: {$record->total_cookies}\n";
            }
        }
    } else {
        echo "$name table ($table_name): DOES NOT EXIST\n";
    }
}

echo "</pre>";
?>