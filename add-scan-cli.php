<?php
// Add a scheduled scan via CLI

// Load WordPress
require_once(dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-load.php');

// Get current time
$now = new DateTime();
echo "Current Server Time: " . $now->format('Y-m-d H:i:s') . "\n";

// Create a time that has already passed (1 minute ago)
$one_minute_ago = clone $now;
$one_minute_ago->modify('-1 minute');

echo "Scheduling scan for (1 minute ago): " . $one_minute_ago->format('Y-m-d H:i:s') . "\n";

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
    echo "Successfully added test scan with ID: " . $schedule_id . "\n";
} else {
    echo "Failed to add test scan: " . $wpdb->last_error . "\n";
}
?>