<?php
// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin capabilities
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('You do not have permission to access this page.');
}

echo "<h1>Custom Cookie Display Test</h1>";

// Get the data that would be sent to the frontend
$custom_cookies_raw = get_option('sure_consent_custom_cookies', '[]');
$custom_cookies = json_decode($custom_cookies_raw, true);

$cookie_categories_raw = get_option('sure_consent_cookie_categories', '[]');
$cookie_categories = json_decode($cookie_categories_raw, true);

echo "<h2>Custom Cookies in Database:</h2>";
echo "<pre>" . print_r($custom_cookies, true) . "</pre>";

echo "<h2>Cookie Categories in Database:</h2>";
echo "<pre>" . print_r($cookie_categories, true) . "</pre>";

// Test matching
echo "<h2>Matching Test:</h2>";
if (is_array($custom_cookies) && is_array($cookie_categories)) {
    foreach ($custom_cookies as $cookie) {
        echo "<p>Cookie: " . esc_html($cookie['name']) . " (Category ID: " . esc_html($cookie['category']) . ")</p>";
        
        // Try to find matching category
        $matching_category = null;
        foreach ($cookie_categories as $category) {
            if ($category['id'] === $cookie['category']) {
                $matching_category = $category;
                break;
            }
        }
        
        if ($matching_category) {
            echo "<p style='color: green;'>✓ Found matching category: " . esc_html($matching_category['name']) . "</p>";
        } else {
            echo "<p style='color: red;'>✗ No matching category found for ID: " . esc_html($cookie['category']) . "</p>";
        }
    }
} else {
    echo "<p>No cookies or categories found</p>";
}

echo "<h2>Test Data for PreferencesModal:</h2>";
echo "<p>This is the data structure that would be passed to the PreferencesModal component:</p>";

$test_settings = array(
    'cookie_categories' => $cookie_categories,
    'custom_cookies' => $custom_cookies
);

echo "<pre>" . print_r($test_settings, true) . "</pre>";
?>