<?php
/**
 * Manually trigger scheduled scan checking
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

echo "<h1>Manually Trigger Scheduled Scan Check</h1>\n";

// Check if user is logged in and has admin privileges
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('You do not have sufficient permissions to access this page.');
}

// Clear any existing redirect flag
delete_option('sure_consent_scheduled_scan_redirect');
echo "<p>Cleared any existing redirect flag.</p>\n";

// Call the check_scheduled_scans method directly
echo "<p>Calling Sure_Consent_Storage::check_scheduled_scans()...</p>\n";

if (class_exists('Sure_Consent_Storage')) {
    Sure_Consent_Storage::check_scheduled_scans();
    echo "<p>check_scheduled_scans method completed</p>\n";
    
    // Check if there's a redirect flag set
    $redirect_data = get_option('sure_consent_scheduled_scan_redirect', false);
    if ($redirect_data) {
        echo "<p><strong style='color: green;'>SUCCESS: Redirect flag is set!</strong></p>\n";
        echo "<p>Redirect data: " . print_r($redirect_data, true) . "</p>\n";
        echo "<p>The scheduled scan should now trigger automatically when you visit the Scan Cookies page.</p>\n";
    } else {
        echo "<p><strong style='color: orange;'>INFO: No redirect flag set</strong></p>\n";
        echo "<p>This means no scheduled scans are due to run at this time.</p>\n";
    }
} else {
    echo "<p><strong style='color: red;'>ERROR: Sure_Consent_Storage class not found</strong></p>\n";
}

echo "<p><a href='/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=schedule'>Back to Schedule Scan</a></p>\n";
?>