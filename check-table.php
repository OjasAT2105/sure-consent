<?php
// Load WordPress
require_once('../../../wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    wp_die('Access denied');
}

global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';

// Check if table exists
$table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name;

echo "<h2>SureConsent - Database Table Check</h2>";

if ($table_exists) {
    echo "<p style='color: green;'>✓ Table '$table_name' exists</p>";
    
    // Get table structure
    $columns = $wpdb->get_results("SHOW COLUMNS FROM $table_name");
    echo "<h3>Table Structure:</h3>";
    echo "<ul>";
    foreach ($columns as $column) {
        echo "<li><strong>{$column->Field}</strong> ({$column->Type}) " . 
             ($column->Null === 'NO' ? 'NOT NULL' : 'NULL') . 
             ($column->Key ? " KEY:{$column->Key}" : '') . 
             ($column->Default !== null ? " DEFAULT:{$column->Default}" : '') . "</li>";
    }
    echo "</ul>";
    
    // Count records
    $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    echo "<p>Total records: $count</p>";
    
    if ($count > 0) {
        // Show sample records
        $records = $wpdb->get_results("SELECT * FROM $table_name ORDER BY timestamp DESC LIMIT 5");
        echo "<h3>Sample Records:</h3>";
        echo "<table border='1' cellpadding='5' cellspacing='0'>";
        echo "<tr>";
        foreach (array_keys((array)$records[0]) as $header) {
            echo "<th>" . esc_html($header) . "</th>";
        }
        echo "</tr>";
        
        foreach ($records as $record) {
            echo "<tr>";
            foreach ((array)$record as $value) {
                echo "<td>" . esc_html($value ?? 'NULL') . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    }
} else {
    echo "<p style='color: red;'>✗ Table '$table_name' does not exist</p>";
    
    // Try to create the table
    echo "<h3>Attempting to create table...</h3>";
    
    require_once(plugin_dir_path(__FILE__) . 'admin/class-sure-consent-storage.php');
    
    if (class_exists('Sure_Consent_Storage')) {
        Sure_Consent_Storage::create_table();
        echo "<p>Table creation attempted. Please refresh this page.</p>";
    } else {
        echo "<p style='color: red;'>Failed to load storage class</p>";
    }
}

echo "<p><a href='" . admin_url('admin.php?page=sureconsent') . "'>Back to SureConsent</a></p>";