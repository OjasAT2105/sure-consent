<?php
/**
 * Test script to manually trigger the scheduled scan checking
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

// Trigger the scheduled scan checking
echo "<h1>Manually Triggering Scheduled Scan Check</h1>\n";

// Check if the function exists
if (class_exists('Sure_Consent_Storage')) {
    echo "<p>Sure_Consent_Storage class found</p>\n";
    
    // Call the check_scheduled_scans method directly
    echo "<p>Calling check_scheduled_scans method...</p>\n";
    Sure_Consent_Storage::check_scheduled_scans();
    echo "<p>check_scheduled_scans method completed</p>\n";
    
    // Check if there's a redirect flag set
    $redirect_data = get_option('sure_consent_scheduled_scan_redirect', false);
    if ($redirect_data) {
        echo "<p>Redirect flag is set: " . print_r($redirect_data, true) . "</p>\n";
    } else {
        echo "<p>No redirect flag set</p>\n";
    }
} else {
    echo "<p>Sure_Consent_Storage class not found</p>\n";
}

echo "<p><a href='/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=schedule'>Back to Schedule Scan</a></p>\n";