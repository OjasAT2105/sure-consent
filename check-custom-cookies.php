<?php
// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin capabilities
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('You do not have permission to access this page.');
}

// Get custom cookies from the database
$custom_cookies_raw = get_option('sure_consent_custom_cookies', '[]');
$custom_cookies = json_decode($custom_cookies_raw, true);

// Get cookie categories
$cookie_categories_raw = get_option('sure_consent_cookie_categories', '[]');
$cookie_categories = json_decode($cookie_categories_raw, true);

echo "<h1>Custom Cookies Data</h1>";
echo "<h2>Raw Data:</h2>";
echo "<pre>" . htmlspecialchars($custom_cookies_raw) . "</pre>";

echo "<h2>Parsed Data:</h2>";
echo "<pre>" . print_r($custom_cookies, true) . "</pre>";

echo "<h2>Cookie Categories:</h2>";
echo "<pre>" . print_r($cookie_categories, true) . "</pre>";

echo "<h2>Matching Test:</h2>";
if (is_array($custom_cookies) && is_array($cookie_categories)) {
    foreach ($custom_cookies as $cookie) {
        echo "<p>Cookie: " . esc_html($cookie['name']) . " (Category: " . esc_html($cookie['category']) . ")</p>";
        
        // Try to find matching category
        $matched = false;
        foreach ($cookie_categories as $category) {
            if (isset($category['id']) && $category['id'] === $cookie['category']) {
                echo "<p style='color: green;'>  -> Matches category ID: " . esc_html($category['name']) . "</p>";
                $matched = true;
                break;
            }
            if (isset($category['name']) && $category['name'] === $cookie['category']) {
                echo "<p style='color: blue;'>  -> Matches category name: " . esc_html($category['name']) . " (ID: " . esc_html($category['id']) . ")</p>";
                $matched = true;
                break;
            }
        }
        
        if (!$matched) {
            echo "<p style='color: red;'>  -> No matching category found</p>";
        }
    }
}

// Test the consent logs
echo "<h1>Recent Consent Logs</h1>";
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';
$latest_logs = $wpdb->get_results("SELECT * FROM $table_name ORDER BY timestamp DESC LIMIT 3");

foreach ($latest_logs as $log) {
    echo "<div style='border: 1px solid #ccc; margin: 10px; padding: 10px;'>";
    echo "<h3>Log ID: " . esc_html($log->id) . "</h3>";
    echo "<p>Timestamp: " . esc_html($log->timestamp) . "</p>";
    echo "<p>Action: " . esc_html($log->action) . "</p>";
    echo "<p>Preferences: " . esc_html($log->preferences) . "</p>";
    
    $preferences = json_decode($log->preferences, true);
    if (is_array($preferences)) {
        echo "<h4>Parsed Preferences:</h4>";
        echo "<ul>";
        foreach ($preferences as $category => $value) {
            $status = ($value === true) ? 'ACCEPTED' : 'DECLINED';
            $color = ($value === true) ? 'green' : 'red';
            echo "<li><strong>" . esc_html($category) . ":</strong> <span style='color: $color;'>" . esc_html($status) . "</span></li>";
        }
        echo "</ul>";
    }
    
    echo "</div>";
}
?>