<?php
// Database test
require_once('../../../wp-config.php');

global $wpdb;

// Enable error reporting
$wpdb->show_errors();

echo "<h2>Database Test</h2>";
echo "<pre>";

// Test database connection
echo "Testing database connection...\n";
echo "WordPress table prefix: " . $wpdb->prefix . "\n";
echo "Last error: " . $wpdb->last_error . "\n";

// Check if tables exist
$tables = array(
    'sure_consent_logs',
    'sure_consent_scanned_cookies',
    'sure_consent_scan_history',
    'sure_consent_scheduled_scans'
);

foreach ($tables as $table) {
    $full_table_name = $wpdb->prefix . $table;
    echo "\nChecking table: $full_table_name\n";
    
    // Try to show table status
    $table_status = $wpdb->get_row("SHOW TABLE STATUS LIKE '$full_table_name'");
    if ($table_status) {
        echo "  Table exists\n";
        echo "  Engine: {$table_status->Engine}\n";
        echo "  Rows: {$table_status->Rows}\n";
    } else {
        echo "  Table does not exist\n";
        echo "  Last error: " . $wpdb->last_error . "\n";
    }
    
    // Try to count records anyway
    $count = $wpdb->get_var("SELECT COUNT(*) FROM $full_table_name");
    if ($count !== null) {
        echo "  Record count: $count\n";
    } else {
        echo "  Could not count records: " . $wpdb->last_error . "\n";
    }
}

// Test creating the tables if they don't exist
echo "\nTesting table creation...\n";
require_once('admin/class-sure-consent-storage.php');
Sure_Consent_Storage::create_table();

// Check again
echo "\nChecking tables after creation attempt...\n";
foreach ($tables as $table) {
    $full_table_name = $wpdb->prefix . $table;
    echo "\nChecking table: $full_table_name\n";
    
    $table_status = $wpdb->get_row("SHOW TABLE STATUS LIKE '$full_table_name'");
    if ($table_status) {
        echo "  Table exists\n";
        echo "  Engine: {$table_status->Engine}\n";
        echo "  Rows: {$table_status->Rows}\n";
    } else {
        echo "  Table still does not exist\n";
        echo "  Last error: " . $wpdb->last_error . "\n";
    }
}

echo "</pre>";
?>