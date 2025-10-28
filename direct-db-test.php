<?php
// Direct database test
require_once('../../../wp-config.php');

global $wpdb;

echo "<h2>Direct Database Test</h2>";
echo "<pre>";

// Test direct database operations
$table_name = $wpdb->prefix . 'sure_consent_scan_history';

// Check if table exists
echo "Checking if table exists: $table_name\n";
$exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'");
echo "Table exists: " . ($exists ? "YES" : "NO") . "\n";

if (!$exists) {
    echo "Table does not exist. Trying to create it...\n";
    
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        scan_date datetime DEFAULT CURRENT_TIMESTAMP,
        total_cookies int(11) DEFAULT 0,
        scan_type varchar(20) DEFAULT 'current_page',
        pages_scanned int(11) DEFAULT 1,
        scan_data longtext,
        PRIMARY KEY (id),
        KEY scan_date (scan_date),
        KEY scan_type (scan_type)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $result = dbDelta($sql);
    echo "Create table result: " . print_r($result, true) . "\n";
    
    // Check again
    $exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'");
    echo "Table exists after creation: " . ($exists ? "YES" : "NO") . "\n";
}

if ($exists) {
    // Test inserting data
    echo "\nTesting data insertion...\n";
    $test_data = array(
        array('name' => 'cookie1', 'category' => 'Essential'),
        array('name' => 'cookie2', 'category' => 'Analytics')
    );
    
    $result = $wpdb->insert(
        $table_name,
        array(
            'scan_date' => current_time('mysql'),
            'total_cookies' => 2,
            'scan_type' => 'test',
            'pages_scanned' => 1,
            'scan_data' => json_encode($test_data)
        )
    );
    
    echo "Insert result: " . ($result !== false ? "SUCCESS (ID: " . $wpdb->insert_id . ")" : "FAILED") . "\n";
    if ($result === false) {
        echo "Last error: " . $wpdb->last_error . "\n";
    }
    
    // Test retrieving data
    echo "\nTesting data retrieval...\n";
    $records = $wpdb->get_results("SELECT * FROM $table_name ORDER BY scan_date DESC LIMIT 5");
    echo "Retrieved " . count($records) . " records\n";
    
    foreach ($records as $record) {
        echo "ID: {$record->id}, Date: {$record->scan_date}, Cookies: {$record->total_cookies}\n";
    }
    
    // Clean up
    if ($wpdb->insert_id) {
        $wpdb->delete($table_name, array('id' => $wpdb->insert_id));
        echo "Cleaned up test record\n";
    }
}

echo "</pre>";
?>