<?php
// Test script to manually trigger redirect check

// Load WordPress environment
require_once('../../../wp-config.php');
require_once('../../../wp-admin/includes/admin.php');

// Load plugin files
require_once('admin/class-sure-consent-storage.php');

echo "Testing scheduled scan redirect check...\n";

// Call the function directly
$result = Sure_Consent_Storage::check_scheduled_scan_redirect();

echo "Result: " . ($result ? "Redirect needed for schedule ID: $result" : "No redirect needed") . "\n";

// Check what's in the database
$redirect_data = get_option('sure_consent_scheduled_scan_redirect', false);
if ($redirect_data) {
    echo "Redirect data: " . print_r($redirect_data, true) . "\n";
} else {
    echo "No redirect data found\n";
}