<?php
// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin capabilities
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('You do not have permission to access this page.');
}

echo "<h1>Custom Cookies Display Test</h1>";

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
            if (isset($category['id']) && $category['id'] === $cookie['category']) {
                $matching_category = $category;
                break;
            }
        }
        
        if ($matching_category) {
            echo "<p style='color: green;'>✓ Found matching category: " . esc_html($matching_category['name']) . " (ID: " . esc_html($matching_category['id']) . ")</p>";
            
            // Show cookies that would appear in this category in the modal
            echo "<p style='margin-left: 20px;'>Cookies in this category that would appear in privacy modal:</p>";
            echo "<ul style='margin-left: 40px;'>";
            echo "<li>" . esc_html($cookie['name']) . "</li>";
            echo "</ul>";
        } else {
            echo "<p style='color: red;'>✗ No matching category found for ID: " . esc_html($cookie['category']) . " - this cookie won't appear in privacy modal</p>";
        }
    }
} else {
    echo "<p>No valid data found</p>";
}

echo "<h2>How to Test in Browser:</h2>";
echo "<ol>";
echo "<li>Go to the admin panel and create a custom cookie in the 'Create Custom Cookies' section</li>";
echo "<li>Make sure to select a valid category from the dropdown</li>";
echo "<li>Save the cookie</li>";
echo "<li>Go to the frontend of your website</li>";
echo "<li>Click the 'Preferences' button in the cookie banner</li>";
echo "<li>Expand the category where you added the cookie</li>";
echo "<li>You should see your custom cookie listed in a table format</li>";
echo "</ol>";

echo "<p><a href='" . admin_url('admin.php?page=sure-consent') . "'>Back to Admin Panel</a></p>";
?>