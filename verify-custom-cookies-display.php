<?php
// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin capabilities
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('You do not have permission to access this page.');
}

// Function to get custom cookies from database
function get_custom_cookies_from_db() {
    $custom_cookies_raw = get_option('sure_consent_custom_cookies', '[]');
    return json_decode($custom_cookies_raw, true);
}

// Function to get cookie categories from database
function get_cookie_categories_from_db() {
    $cookie_categories_raw = get_option('sure_consent_cookie_categories', '[]');
    return json_decode($cookie_categories_raw, true);
}

// Get data
$custom_cookies = get_custom_cookies_from_db();
$cookie_categories = get_cookie_categories_from_db();

echo "<h1>Custom Cookies Display Verification</h1>";

echo "<h2>Cookie Categories:</h2>";
echo "<pre>" . print_r($cookie_categories, true) . "</pre>";

echo "<h2>Custom Cookies:</h2>";
echo "<pre>" . print_r($custom_cookies, true) . "</pre>";

// Verify matching
echo "<h2>Verification:</h2>";
if (is_array($custom_cookies) && is_array($cookie_categories)) {
    foreach ($custom_cookies as $cookie) {
        echo "<p>Cookie: <strong>" . esc_html($cookie['name']) . "</strong> (Category ID: " . esc_html($cookie['category']) . ")</p>";
        
        // Try to find matching category
        $matching_category = null;
        foreach ($cookie_categories as $category) {
            if ($category['id'] === $cookie['category']) {
                $matching_category = $category;
                break;
            }
        }
        
        if ($matching_category) {
            echo "<p style='color: green;'>✓ Found matching category: <strong>" . esc_html($matching_category['name']) . "</strong></p>";
        } else {
            echo "<p style='color: red;'>✗ No matching category found for ID: " . esc_html($cookie['category']) . "</p>";
        }
    }
} else {
    echo "<p>No cookies or categories found</p>";
}

echo "<h2>Test Instructions:</h2>";
echo "<ol>";
echo "<li>Create a custom cookie in the admin area with a specific category</li>";
echo "<li>Save the cookie</li>";
echo "<li>Open the privacy preferences modal in both admin preview and frontend</li>";
echo "<li>Click on the arrow next to a category that has custom cookies</li>";
echo "<li>Verify that the custom cookies appear in a table format</li>";
echo "</ol>";

echo "<h2>Expected Behavior:</h2>";
echo "<ul>";
echo "<li>Custom cookies should appear in the privacy preferences modal</li>";
echo "<li>Both admin preview and frontend should show the same custom cookies</li>";
echo "<li>Cookie category filtering should work correctly using consistent ID-based matching</li>";
echo "<li>When clicking on a category arrow, custom cookies in that category should be displayed in a table</li>";
echo "</ul>";
?>