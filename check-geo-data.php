<?php
// Check if geo data exists
require_once('../../../wp-config.php');
require_once('../../../wp-admin/includes/upgrade.php');

global $wpdb;

$table_name = $wpdb->prefix . 'sure_consent_geo_visits';

echo "Checking geo visits data...\n";

// Count records
$count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
echo "Total geo visits: $count\n";

// Show first 10 records
$results = $wpdb->get_results("SELECT * FROM $table_name LIMIT 10");
echo "First 10 records:\n";
foreach ($results as $row) {
    echo "ID: {$row->id}, IP: {$row->ip_address}, Country: {$row->country_code}, Time: {$row->visit_time}\n";
}

echo "Done.\n";
?>