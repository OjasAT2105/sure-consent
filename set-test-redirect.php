<?php
// Test script to manually set a redirect flag

// Load WordPress environment
require_once('../../../wp-config.php');
require_once('../../../wp-admin/includes/admin.php');

// Load plugin files
require_once('admin/class-sure-consent-storage.php');

echo "Setting test redirect flag...\n";

// Set a redirect flag
update_option('sure_consent_scheduled_scan_redirect', array(
    'schedule_id' => 1,
    'timestamp' => time()
));

echo "Redirect flag set. Now visit the admin page to see if it triggers.\n";

// Check what's in the database
$redirect_data = get_option('sure_consent_scheduled_scan_redirect', false);
if ($redirect_data) {
    echo "Redirect data: " . print_r($redirect_data, true) . "\n";
} else {
    echo "No redirect data found\n";
}