<?php
// Test AJAX endpoint
require_once('../../../wp-config.php');
require_once('../../../wp-admin/includes/upgrade.php');

// Simulate AJAX request for geo analytics
$_POST['action'] = 'sure_consent_get_geo_analytics';
$_POST['nonce'] = wp_create_nonce('sure_consent_nonce');

// Include the AJAX handler
require_once('admin/class-sure-consent-ajax.php');

// Call the function directly
echo "Testing geo analytics AJAX endpoint...\n";
Sure_Consent_Ajax::get_geo_analytics();
?>