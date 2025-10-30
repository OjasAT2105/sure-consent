<?php
/**
 * Add a test scheduled scan that should have already run
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

echo "<h1>Add Test Scheduled Scan</h1>\n";

// Get current time
$now = new DateTime();
echo "<p><strong>Current Server Time:</strong> " . $now->format('Y-m-d H:i:s') . "</p>\n";

// Create a time that has already passed (1 minute ago)
$one_minute_ago = clone $now;
$one_minute_ago->modify('-1 minute');

echo "<p><strong>Scheduling scan for (1 minute ago):</strong> " . $one_minute_ago->format('Y-m-d H:i:s') . "</p>\n";

// Insert a scheduled scan that should have already run
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_scheduled_scans';

$result = $wpdb->insert(
    $table_name,
    array(
        'frequency' => 'daily',
        'start_date' => $one_minute_ago->format('Y-m-d'),
        'start_time' => $one_minute_ago->format('H:i:s'),
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
    echo "<p><strong>Successfully added test scan with ID:</strong> " . $schedule_id . "</p>\n";
    echo "<p>This scan should trigger on the next cron run since its start time has passed.</p>\n";
    
    // Clear any existing redirect flag
    delete_option('sure_consent_scheduled_scan_redirect');
    echo "<p>Cleared any existing redirect flag.</p>\n";
    
    // Test the scheduled scan checking logic immediately
    echo "<h2>Testing Scheduled Scan Check Immediately</h2>\n";
    if (class_exists('Sure_Consent_Storage')) {
        echo "<p>Calling Sure_Consent_Storage::check_scheduled_scans()...</p>\n";
        Sure_Consent_Storage::check_scheduled_scans();
        
        // Check if redirect flag was set
        $redirect_data = get_option('sure_consent_scheduled_scan_redirect', false);
        if ($redirect_data) {
            echo "<p><strong style='color: green;'>SUCCESS: Redirect flag was set!</strong></p>\n";
            echo "<p>Redirect data: " . print_r($redirect_data, true) . "</p>\n";
        } else {
            echo "<p><strong style='color: red;'>FAILED: No redirect flag was set</strong></p>\n";
        }
    }
} else {
    echo "<p><strong>Failed to add test scan:</strong> " . $wpdb->last_error . "</p>\n";
}

echo "<p><a href='/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=schedule'>Back to Schedule Scan</a></p>\n";
?>