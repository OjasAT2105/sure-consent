<?php
/**
 * Debug scheduled scans - comprehensive diagnostic
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/admin
 */

// Direct access forbidden
if (!defined('WPINC')) {
    die;
}

// Load WordPress
require_once('../../../wp-load.php');

echo "<h1>SureConsent Scheduled Scans Debug</h1>\n";

// Get current time
$now = new DateTime();
echo "<p><strong>Current Server Time:</strong> " . $now->format('Y-m-d H:i:s') . "</p>\n";

// Get scheduled scans from database
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_scheduled_scans';

echo "<h2>Scheduled Scans in Database</h2>\n";

$results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");

if ($results) {
    echo "<table border='1' cellpadding='5' cellspacing='0'>\n";
    echo "<tr><th>ID</th><th>Frequency</th><th>Start Date</th><th>Start Time</th><th>End Date</th><th>Created At</th><th>Should Run Now?</th></tr>\n";
    
    foreach ($results as $row) {
        $schedule_datetime = new DateTime($row->start_date . ' ' . $row->start_time);
        $should_run = $schedule_datetime <= $now ? 'YES' : 'NO (Future)';
        
        echo "<tr>\n";
        echo "<td>" . $row->id . "</td>\n";
        echo "<td>" . $row->frequency . "</td>\n";
        echo "<td>" . $row->start_date . "</td>\n";
        echo "<td>" . $row->start_time . "</td>\n";
        echo "<td>" . ($row->end_date ?: 'None') . "</td>\n";
        echo "<td>" . $row->created_at . "</td>\n";
        echo "<td>" . $should_run . "</td>\n";
        echo "</tr>\n";
    }
    
    echo "</table>\n";
} else {
    echo "<p>No scheduled scans found in database</p>\n";
}

// Check last run times
echo "<h2>Last Run Times</h2>\n";
$options_table = $wpdb->prefix . 'options';
$last_run_results = $wpdb->get_results("SELECT option_name, option_value FROM $options_table WHERE option_name LIKE 'sure_consent_last_scheduled_scan_%'");

if ($last_run_results) {
    echo "<table border='1' cellpadding='5' cellspacing='0'>\n";
    echo "<tr><th>Option Name</th><th>Last Run Time</th></tr>\n";
    
    foreach ($last_run_results as $row) {
        echo "<tr>\n";
        echo "<td>" . $row->option_name . "</td>\n";
        echo "<td>" . $row->option_value . "</td>\n";
        echo "</tr>\n";
    }
    
    echo "</table>\n";
} else {
    echo "<p>No last run times found</p>\n";
}

// Check redirect flag
echo "<h2>Redirect Flag</h2>\n";
$redirect_flag = get_option('sure_consent_scheduled_scan_redirect', false);
if ($redirect_flag) {
    echo "<p>Redirect flag is set: " . print_r($redirect_flag, true) . "</p>\n";
} else {
    echo "<p>No redirect flag set</p>\n";
}

// Test the scheduled scan checking logic
echo "<h2>Test Scheduled Scan Checking Logic</h2>\n";
echo "<p>Manually calling Sure_Consent_Storage::check_scheduled_scans()...</p>\n";

if (class_exists('Sure_Consent_Storage')) {
    echo "<p>Sure_Consent_Storage class found, calling check_scheduled_scans()</p>\n";
    Sure_Consent_Storage::check_scheduled_scans();
    echo "<p>check_scheduled_scans() completed</p>\n";
    
    // Check if redirect flag was set
    $redirect_data = get_option('sure_consent_scheduled_scan_redirect', false);
    if ($redirect_data) {
        echo "<p><strong>Redirect flag was set during test:</strong> " . print_r($redirect_data, true) . "</p>\n";
    } else {
        echo "<p>No redirect flag was set during test</p>\n";
    }
} else {
    echo "<p>Sure_Consent_Storage class not found</p>\n";
}

echo "<p><a href='/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=schedule'>Back to Schedule Scan</a></p>\n";
?>