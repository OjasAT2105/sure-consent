<?php
// Test script to manually trigger scheduled scan check

// Load WordPress environment
require_once('../../../wp-config.php');
require_once('../../../wp-admin/includes/admin.php');

// Load plugin files
require_once('admin/class-sure-consent-storage.php');

echo "Testing scheduled scan check...\n";
echo "Current time: " . current_time('mysql') . "\n";

// Call the function directly
$result = Sure_Consent_Storage::check_scheduled_scans();

echo "Result: " . ($result ? "Scan triggered for schedule ID: $result" : "No scans due") . "\n";

// Check what's in the database
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_scheduled_scans';
$schedules = $wpdb->get_results("SELECT * FROM $table_name");

echo "Current scheduled scans:\n";
foreach ($schedules as $schedule) {
    echo "ID: {$schedule->id}, Frequency: {$schedule->frequency}, Start: {$schedule->start_date} {$schedule->start_time}, Last Run: {$schedule->last_run}\n";
}

// Check for redirect flag
$redirect_data = get_option('sure_consent_scheduled_scan_redirect', false);
if ($redirect_data) {
    echo "Redirect flag found: " . print_r($redirect_data, true) . "\n";
} else {
    echo "No redirect flag found\n";
}