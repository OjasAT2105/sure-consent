<?php
// Test table creation
require_once('../../../wp-config.php');
require_once('admin/class-sure-consent-storage.php');

echo "<h2>Testing Table Creation</h2>";
echo "<pre>";

// Call create_table method
echo "Calling Sure_Consent_Storage::create_table()...\n";
Sure_Consent_Storage::create_table();

// Check if tables exist
global $wpdb;
$tables = array(
    'sure_consent_logs',
    'sure_consent_scanned_cookies',
    'sure_consent_scan_history',
    'sure_consent_scheduled_scans'
);

echo "\nChecking table status:\n";
foreach ($tables as $table) {
    $full_table_name = $wpdb->prefix . $table;
    echo "\nTable: $full_table_name\n";
    
    // Try to show table status
    $table_status = $wpdb->get_row("SHOW TABLE STATUS LIKE '$full_table_name'");
    if ($table_status) {
        echo "  Status: EXISTS\n";
        echo "  Engine: {$table_status->Engine}\n";
        echo "  Rows: {$table_status->Rows}\n";
        echo "  Collation: {$table_status->Collation}\n";
    } else {
        echo "  Status: DOES NOT EXIST\n";
        echo "  Error: " . $wpdb->last_error . "\n";
    }
}

echo "\nDone.</pre>";
?>