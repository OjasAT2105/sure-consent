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

echo "<h1>Debug Cookie Display Issue</h1>";
echo "<h2>Raw Custom Cookies Data:</h2>";
echo "<pre>" . htmlspecialchars($custom_cookies_raw) . "</pre>";

echo "<h2>Parsed Custom Cookies Data:</h2>";
echo "<pre>" . print_r($custom_cookies, true) . "</pre>";

echo "<h2>Raw Cookie Categories Data:</h2>";
echo "<pre>" . htmlspecialchars($cookie_categories_raw) . "</pre>";

echo "<h2>Parsed Cookie Categories Data:</h2>";
echo "<pre>" . print_r($cookie_categories, true) . "</pre>";

echo "<h2>Matching Test:</h2>";
if (is_array($custom_cookies) && is_array($cookie_categories)) {
    foreach ($custom_cookies as $cookie) {
        echo "<p>Cookie: " . esc_html($cookie['name']) . " (Category ID: " . esc_html($cookie['category']) . ")</p>";
        
        // Try to find matching category
        $matched = false;
        foreach ($cookie_categories as $category) {
            if (isset($category['id']) && $category['id'] === $cookie['category']) {
                echo "<p style='color: green;'>✓ Matched with category: " . esc_html($category['name']) . " (ID: " . esc_html($category['id']) . ")</p>";
                $matched = true;
                break;
            }
        }
        
        if (!$matched) {
            echo "<p style='color: red;'>✗ No matching category found</p>";
        }
    }
} else {
    echo "<p>No valid data found</p>";
}

echo "<h2>Frontend Test Data:</h2>";
echo "<p>This is what the frontend would receive:</p>";

$frontend_data = array(
    'cookie_categories' => $cookie_categories,
    'custom_cookies' => $custom_cookies
);

echo "<pre>" . print_r($frontend_data, true) . "</pre>";

// Test the AJAX endpoint that the frontend uses
echo "<h2>Testing AJAX Endpoint:</h2>";
echo "<p>Simulating frontend request to get_public_settings...</p>";

// Simulate the AJAX call
$ajax_response = wp_remote_post(admin_url('admin-ajax.php'), array(
    'body' => array(
        'action' => 'sure_consent_get_public_settings'
    )
));

if (!is_wp_error($ajax_response)) {
    $response_body = wp_remote_retrieve_body($ajax_response);
    echo "<h3>AJAX Response:</h3>";
    echo "<pre>" . htmlspecialchars($response_body) . "</pre>";
    
    $response_data = json_decode($response_body, true);
    if ($response_data && isset($response_data['success']) && $response_data['success']) {
        echo "<p style='color: green;'>✓ AJAX request successful</p>";
        if (isset($response_data['data']['custom_cookies'])) {
            echo "<p>Custom cookies in AJAX response: " . count($response_data['data']['custom_cookies']) . "</p>";
            echo "<h4>Custom Cookies Details:</h4>";
            foreach ($response_data['data']['custom_cookies'] as $cookie) {
                echo "<p>Cookie: " . esc_html($cookie['name']) . " (Category: " . esc_html($cookie['category']) . ")</p>";
            }
        }
        if (isset($response_data['data']['cookie_categories'])) {
            echo "<p>Cookie categories in AJAX response: " . count($response_data['data']['cookie_categories']) . "</p>";
            echo "<h4>Cookie Categories Details:</h4>";
            foreach ($response_data['data']['cookie_categories'] as $category) {
                echo "<p>Category: " . esc_html($category['name']) . " (ID: " . esc_html($category['id']) . ")</p>";
            }
        }
    } else {
        echo "<p style='color: red;'>✗ AJAX request failed</p>";
    }
} else {
    echo "<p style='color: red;'>✗ AJAX request error: " . $ajax_response->get_error_message() . "</p>";
}

echo "<h2>Testing Admin AJAX Endpoint:</h2>";
echo "<p>Simulating admin request to get_settings...</p>";

// Simulate the AJAX call for admin settings
$admin_ajax_response = wp_remote_post(admin_url('admin-ajax.php'), array(
    'body' => array(
        'action' => 'sure_consent_get_settings',
        'nonce' => wp_create_nonce('sure_consent_nonce')
    )
));

if (!is_wp_error($admin_ajax_response)) {
    $admin_response_body = wp_remote_retrieve_body($admin_ajax_response);
    echo "<h3>Admin AJAX Response:</h3>";
    echo "<pre>" . htmlspecialchars($admin_response_body) . "</pre>";
    
    $admin_response_data = json_decode($admin_response_body, true);
    if ($admin_response_data && isset($admin_response_data['success']) && $admin_response_data['success']) {
        echo "<p style='color: green;'>✓ Admin AJAX request successful</p>";
        if (isset($admin_response_data['data']['custom_cookies'])) {
            echo "<p>Custom cookies in Admin AJAX response: " . count($admin_response_data['data']['custom_cookies']) . "</p>";
            echo "<h4>Custom Cookies Details:</h4>";
            foreach ($admin_response_data['data']['custom_cookies'] as $cookie) {
                echo "<p>Cookie: " . esc_html($cookie['name']) . " (Category: " . esc_html($cookie['category']) . ")</p>";
            }
        }
        if (isset($admin_response_data['data']['cookie_categories'])) {
            echo "<p>Cookie categories in Admin AJAX response: " . count($admin_response_data['data']['cookie_categories']) . "</p>";
            echo "<h4>Cookie Categories Details:</h4>";
            foreach ($admin_response_data['data']['cookie_categories'] as $category) {
                echo "<p>Category: " . esc_html($category['name']) . " (ID: " . esc_html($category['id']) . ")</p>";
            }
        }
    } else {
        echo "<p style='color: red;'>✗ Admin AJAX request failed</p>";
    }
} else {
    echo "<p style='color: red;'>✗ Admin AJAX request error: " . $admin_ajax_response->get_error_message() . "</p>";
}
?>