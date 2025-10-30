<?php
// Test scan history functionality
require_once('../../../wp-config.php');
require_once('admin/class-sure-consent-storage.php');

echo "<h2>Testing Scan History Functionality</h2>";
echo "<pre>";

// Test saving scan history
echo "Testing save_scan_history...\n";
$test_data = array(
    array('name' => 'test_cookie_1', 'category' => 'Essential Cookies'),
    array('name' => 'test_cookie_2', 'category' => 'Analytics Cookies'),
    array('name' => 'test_cookie_3', 'category' => 'Marketing Cookies')
);

$history_id = Sure_Consent_Storage::save_scan_history(3, 'test', 1, $test_data);
echo "Save result: " . ($history_id ? "SUCCESS (ID: $history_id)" : "FAILED") . "\n";

if ($history_id) {
    // Test retrieving scan history
    echo "\nTesting get_scan_history...\n";
    $history = Sure_Consent_Storage::get_scan_history(10, 0);
    echo "Retrieved " . count($history) . " records\n";
    
    if (!empty($history)) {
        echo "First record:\n";
        print_r($history[0]);
    }
    
    // Test get_scan_history_count
    echo "\nTesting get_scan_history_count...\n";
    $count = Sure_Consent_Storage::get_scan_history_count();
    echo "Total count: $count\n";
}

echo "</pre>";
?>