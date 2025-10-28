<?php
/**
 * Test script to verify scheduled scan functionality
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

echo "<h1>Test Scheduled Scan Functionality</h1>\n";

// Check if user is logged in and has admin privileges
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('You do not have sufficient permissions to access this page.');
}

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
    echo "<p><strong style='color: green;'>SUCCESS: Added test scan with ID:</strong> " . $schedule_id . "</p>\n";
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
            echo "<p><strong style='color: orange;'>INFO: No redirect flag was set during immediate test</strong></p>\n";
            echo "<p>This is normal - the redirect flag will be set when the actual cron job runs.</p>\n";
        }
    }
    
    echo "<p><strong>Next steps:</strong></p>\n";
    echo "<ol>\n";
    echo "<li>Wait for the next cron job to run (should be within 1 minute)</li>\n";
    echo "<li>Check the WordPress debug log for entries showing the redirect flag was set</li>\n";
    echo "<li>Visit the Schedule Scan page to see if the redirect occurs</li>\n";
    echo "</ol>\n";
} else {
    echo "<p><strong style='color: red;'>FAILED: Could not add test scan:</strong> " . $wpdb->last_error . "</p>\n";
}

echo "<p><a href='/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=schedule'>Back to Schedule Scan</a></p>\n";
?>
```

```
<?php
// Test script to manually trigger scheduled scan check

// Load WordPress environment
require_once('wp-config.php');
require_once('wp-admin/includes/admin.php');

// Load plugin files
require_once('admin/class-sure-consent-storage.php');

echo "Testing scheduled scan check...\n";

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

// Check for notifications
$notification = get_option('sure_consent_last_scan_notification');
if ($notification) {
    echo "Notification found: " . print_r($notification, true) . "\n";
} else {
    echo "No notification found\n";
}
