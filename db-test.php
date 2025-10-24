<?php
// Test database connection and data
require_once('../../../wp-config.php');

global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';

echo "<h2>Database Test</h2>";

// Test basic connection
echo "<h3>Basic Connection Test</h3>";
echo "<p>Table name: $table_name</p>";

// Check if table exists
$table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'");
echo "<p>Table exists: " . ($table_exists ? 'Yes' : 'No') . "</p>";

if ($table_exists) {
    // Get record count
    $total_records = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    echo "<p>Total records: $total_records</p>";
    
    // Get action counts
    $action_counts = $wpdb->get_results("SELECT action, COUNT(*) as count FROM $table_name GROUP BY action");
    echo "<h3>Action Counts</h3>";
    if (!empty($action_counts)) {
        echo "<ul>";
        foreach ($action_counts as $row) {
            echo "<li>Action: {$row->action}, Count: {$row->count}</li>";
        }
        echo "</ul>";
    } else {
        echo "<p>No records found</p>";
    }
    
    // Test a simple query with the accepted filter
    echo "<h3>Test Query with 'accepted' filter</h3>";
    $test_query = "SELECT * FROM $table_name WHERE (action = 'accepted' OR action = 'accept_all') ORDER BY timestamp DESC LIMIT 5";
    echo "<p>Query: $test_query</p>";
    
    $test_results = $wpdb->get_results($test_query);
    echo "<p>Results count: " . count($test_results) . "</p>";
    
    if (!empty($test_results)) {
        echo "<table border='1'>";
        echo "<tr><th>ID</th><th>Action</th><th>Timestamp</th></tr>";
        foreach ($test_results as $row) {
            echo "<tr>";
            echo "<td>{$row->id}</td>";
            echo "<td>{$row->action}</td>";
            echo "<td>{$row->timestamp}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
} else {
    echo "<p>Table does not exist!</p>";
}

echo "<p>Test completed.</p>";
?>