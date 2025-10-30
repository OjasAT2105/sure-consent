<?php
// Test script to verify script blocker table creation

// Load WordPress environment
require_once('wp-config.php');

global $wpdb;

// Check if the table exists
$table_name = $wpdb->prefix . 'sure_consent_blocked_scripts';
$table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'");

if ($table_exists) {
    echo "Script blocker table exists: $table_name\n";
    
    // Describe the table structure
    $columns = $wpdb->get_results("DESCRIBE $table_name");
    echo "Table structure:\n";
    foreach ($columns as $column) {
        echo "- {$column->Field} ({$column->Type})\n";
    }
    
    // Try to insert a test record
    $result = $wpdb->insert(
        $table_name,
        array(
            'script_name' => 'Test Script',
            'script_description' => 'Test script for verification',
            'script_code' => '<script>console.log("test");</script>',
            'category' => 'marketing',
            'status' => 'active'
        ),
        array(
            '%s', // script_name
            '%s', // script_description
            '%s', // script_code
            '%s', // category
            '%s'  // status
        )
    );
    
    if ($result !== false) {
        echo "\nSuccessfully inserted test record with ID: " . $wpdb->insert_id . "\n";
        
        // Retrieve the test record
        $test_record = $wpdb->get_row("SELECT * FROM $table_name WHERE id = " . $wpdb->insert_id);
        if ($test_record) {
            echo "Retrieved test record:\n";
            print_r($test_record);
        }
        
        // Clean up - delete the test record
        $wpdb->delete($table_name, array('id' => $wpdb->insert_id), array('%d'));
        echo "\nCleaned up test record\n";
    } else {
        echo "\nFailed to insert test record: " . $wpdb->last_error . "\n";
    }
} else {
    echo "Script blocker table does not exist: $table_name\n";
    
    // Try to create the table
    echo "Attempting to create the table...\n";
    
    // Include the storage class
    require_once('admin/class-sure-consent-storage.php');
    
    // Call the create_table method
    if (class_exists('Sure_Consent_Storage')) {
        Sure_Consent_Storage::create_table();
        echo "Table creation attempt completed\n";
    } else {
        echo "Storage class not found\n";
    }
}
?>