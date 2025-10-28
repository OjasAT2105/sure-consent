<?php
/**
 * Check scheduled scans in database
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

// Get scheduled scans from database
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_scheduled_scans';

echo "<h1>Scheduled Scans in Database</h1>\n";

$results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");

if ($results) {
    echo "<table border='1' cellpadding='5' cellspacing='0'>\n";
    echo "<tr><th>ID</th><th>Frequency</th><th>Start Date</th><th>Start Time</th><th>End Date</th><th>Created At</th></tr>\n";
    
    foreach ($results as $row) {
        echo "<tr>\n";
        echo "<td>" . $row->id . "</td>\n";
        echo "<td>" . $row->frequency . "</td>\n";
        echo "<td>" . $row->start_date . "</td>\n";
        echo "<td>" . $row->start_time . "</td>\n";
        echo "<td>" . ($row->end_date ?: 'None') . "</td>\n";
        echo "<td>" . $row->created_at . "</td>\n";
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

echo "<p><a href='/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=schedule'>Back to Schedule Scan</a></p>\n";
?>