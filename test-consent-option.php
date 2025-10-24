<?php
// Test script to check the consent log option value
require_once('../../../wp-config.php');

echo "=== Testing SureConsent enable_consent_log Option ===\n\n";

// Check current value
$value = get_option('sure_consent_enable_consent_log', 'NOT SET');
$type = gettype($value);

echo "Current value: ";
var_dump($value);
echo "Type: " . $type . "\n\n";

// Try setting it to false
echo "Setting to false...\n";
update_option('sure_consent_enable_consent_log', false);

// Check again
$value = get_option('sure_consent_enable_consent_log', 'NOT SET');
$type = gettype($value);

echo "After setting to false:\n";
var_dump($value);
echo "Type: " . $type . "\n\n";

// Try setting it to true
echo "Setting to true...\n";
update_option('sure_consent_enable_consent_log', true);

// Check again
$value = get_option('sure_consent_enable_consent_log', 'NOT SET');
$type = gettype($value);

echo "After setting to true:\n";
var_dump($value);
echo "Type: " . $type . "\n\n";

echo "=== Test Complete ===\n";