<?php
/**
 * Schedule a test scan for the next minute
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

echo "<h1>Schedule Test Scan for Next Minute</h1>\n";

// Get current time and add one minute
$now = new DateTime();
$next_minute = clone $now;
$next_minute->modify('+1 minute');

echo "<p><strong>Current Server Time:</strong> " . $now->format('Y-m-d H:i:s') . "</p>\n";
echo "<p><strong>Scheduling scan for:</strong> " . $next_minute->format('Y-m-d H:i:s') . "</p>\n";

// Insert a scheduled scan for the next minute
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_scheduled_scans';

$result = $wpdb->insert(
    $table_name,
    array(
        'frequency' => 'daily',
        'start_date' => $next_minute->format('Y-m-d'),
        'start_time' => $next_minute->format('H:i:s'),
        'end_date' => null,
        'created_at' => current_time('mysql'),
        'updated_at' => current_time('mysql')
    ),
    array(
        '%s', // frequency
        '%s', // start_date
        '%s', // start_time
        '%s', // end_date
        '%s', // created_at
        '%s'  // updated_at
    )
);

if ($result !== false) {
    $schedule_id = $wpdb->insert_id;
    echo "<p><strong>Successfully scheduled scan with ID:</strong> " . $schedule_id . "</p>\n";
    echo "<p>This scan should trigger within the next minute.</p>\n";
    
    // Clear any existing redirect flag
    delete_option('sure_consent_scheduled_scan_redirect');
    echo "<p>Cleared any existing redirect flag.</p>\n";
} else {
    echo "<p><strong>Failed to schedule scan:</strong> " . $wpdb->last_error . "</p>\n";
}

echo "<p><a href='/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=schedule'>Back to Schedule Scan</a></p>\n";
echo "<p><a href='/wp-content/plugins/sure-consent/debug-scheduled-scans.php'>Debug Scheduled Scans</a></p>\n";
?>