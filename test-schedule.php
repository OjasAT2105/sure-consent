<?php
// Test script to manually create a scheduled scan

// Load WordPress environment
require_once('../../../wp-config.php');
require_once('../../../wp-admin/includes/admin.php');

// Load plugin files
require_once('admin/class-sure-consent-storage.php');

echo "Creating test scheduled scan...\n";

// Get current time and add 1 minute
$now = new DateTime();
$now->modify('+1 minute');
$date = $now->format('Y-m-d');
$time = $now->format('H:i:s');

echo "Scheduling scan for: " . $date . " " . $time . "\n";

// Create a test scheduled scan
$data = array(
    'frequency' => 'daily',
    'start_date' => $date,
    'start_time' => $time,
    'end_date' => null
);

$result = Sure_Consent_Storage::save_scheduled_scan($data);

if ($result) {
    echo "Test scheduled scan created with ID: " . $result . "\n";
    echo "It should trigger automatically in about 1 minute.\n";
} else {
    echo "Failed to create test scheduled scan\n";
}

// Check scheduled events
echo "Checking scheduled events...\n";
$next_run = wp_next_scheduled('sure_consent_run_scheduled_scan', array($result));
if ($next_run) {
    echo "Next run scheduled for: " . date('Y-m-d H:i:s', $next_run) . "\n";
} else {
    echo "No scheduled event found\n";
}