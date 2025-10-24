<?php
// Detailed debug script to test the exact queries being generated
require_once('../../../wp-config.php');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Detailed Debug of Consent Log Filter Queries</h2>";

// Include the storage class
require_once('admin/class-sure-consent-storage.php');

global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';

// Test data
$status = 'accepted';
$page = 1;
$per_page = 10;
$offset = ($page - 1) * $per_page;

echo "<h3>Test Parameters</h3>";
echo "<p>Status: $status</p>";
echo "<p>Page: $page</p>";
echo "<p>Per Page: $per_page</p>";
echo "<p>Offset: $offset</p>";

// Build query like the storage class does
$where_conditions = array();
$where_values = array();

if ($status !== 'all') {
    if ($status === 'accepted') {
        // For 'accepted' status, we want to match both 'accept_all' and 'accepted' in the database
        $where_conditions[] = "(action = 'accepted' OR action = 'accept_all')";
    } else {
        $where_conditions[] = "action = %s";
        $where_values[] = $status;
    }
}

// Build WHERE clause
$where_clause = "";
if (!empty($where_conditions)) {
    $where_clause = "WHERE " . implode(" AND ", $where_conditions);
}

echo "<h3>Query Construction</h3>";
echo "<p>WHERE conditions: " . print_r($where_conditions, true) . "</p>";
echo "<p>WHERE values: " . print_r($where_values, true) . "</p>";
echo "<p>WHERE clause: $where_clause</p>";

// Test count query
$count_query = "SELECT COUNT(*) FROM $table_name $where_clause";
if (!empty($where_values)) {
    $count_query = $wpdb->prepare($count_query, $where_values);
}

echo "<h3>Count Query</h3>";
echo "<p>Query: $count_query</p>";

$count_result = $wpdb->get_var($count_query);
echo "<p>Count result: $count_result</p>";

// Test main query
$query = "SELECT * FROM $table_name $where_clause ORDER BY timestamp DESC LIMIT %d OFFSET %d";

// Handle complex queries with OR conditions
if (!empty($where_conditions) && strpos($where_clause, 'OR') !== false) {
    // For complex queries with OR conditions, construct the query directly
    $final_query = "SELECT * FROM $table_name $where_clause ORDER BY timestamp DESC LIMIT $per_page OFFSET $offset";
    echo "<h3>Main Query (Complex)</h3>";
    echo "<p>Query: $final_query</p>";
    
    $results = $wpdb->get_results($final_query);
} else if (!empty($where_values)) {
    // Add pagination parameters to query values
    $query_values = $where_values;
    $query_values[] = $per_page;
    $query_values[] = $offset;
    
    $final_query = $wpdb->prepare($query, $query_values);
    echo "<h3>Main Query (With Values)</h3>";
    echo "<p>Query: $final_query</p>";
    
    $results = $wpdb->get_results($final_query);
} else {
    // No filters, just add pagination
    $final_query = $wpdb->prepare($query, $per_page, $offset);
    echo "<h3>Main Query (No Filters)</h3>";
    echo "<p>Query: $final_query</p>";
    
    $results = $wpdb->get_results($final_query);
}

echo "<h3>Results</h3>";
echo "<p>Number of results: " . count($results) . "</p>";

if (!empty($results)) {
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Action</th><th>Timestamp</th></tr>";
    foreach ($results as $row) {
        echo "<tr>";
        echo "<td>{$row->id}</td>";
        echo "<td>{$row->action}</td>";
        echo "<td>{$row->timestamp}</td>";
        echo "</tr>";
    }
    echo "</table>";
}

echo "<p>Debug completed.</p>";
?>