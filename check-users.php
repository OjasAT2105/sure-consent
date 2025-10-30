<?php
// Check WordPress users
require_once('../../../wp-config.php');
require_once('../../../wp-admin/includes/upgrade.php');

global $wpdb;

echo "Checking WordPress users...\n";

// Get users table
$users_table = $wpdb->prefix . 'users';

// Count users
$count = $wpdb->get_var("SELECT COUNT(*) FROM $users_table");
echo "Total users: $count\n";

// Show first 5 users
$results = $wpdb->get_results("SELECT user_login, user_email FROM $users_table LIMIT 5");
echo "First 5 users:\n";
foreach ($results as $row) {
    echo "Username: {$row->user_login}, Email: {$row->user_email}\n";
}

echo "Done.\n";
?>