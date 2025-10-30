<?php
/**
 * Plugin Name: SureConsent Cookie Debug
 * Description: Debug tool for cookie visibility issues
 * Version: 1.0
 */

// Add admin menu for debugging
add_action('admin_menu', 'sureconsent_debug_menu');

function sureconsent_debug_menu() {
    add_submenu_page(
        'sureconsent',
        'Cookie Debug',
        'Cookie Debug',
        'manage_options',
        'sureconsent-cookie-debug',
        'sureconsent_debug_page'
    );
}

function sureconsent_debug_page() {
    // Get custom cookies from the database
    $custom_cookies_raw = get_option('sure_consent_custom_cookies', '[]');
    $custom_cookies = json_decode($custom_cookies_raw, true);
    
    // Get cookie categories
    $cookie_categories_raw = get_option('sure_consent_cookie_categories', '[]');
    $cookie_categories = json_decode($cookie_categories_raw, true);
    
    echo '<div class="wrap">';
    echo '<h1>SureConsent Cookie Debug</h1>';
    
    echo '<h2>Raw Custom Cookies Data:</h2>';
    echo '<pre>' . esc_html($custom_cookies_raw) . '</pre>';
    
    echo '<h2>Parsed Custom Cookies Data:</h2>';
    echo '<pre>' . print_r($custom_cookies, true) . '</pre>';
    
    echo '<h2>Raw Cookie Categories Data:</h2>';
    echo '<pre>' . esc_html($cookie_categories_raw) . '</pre>';
    
    echo '<h2>Parsed Cookie Categories Data:</h2>';
    echo '<pre>' . print_r($cookie_categories, true) . '</pre>';
    
    echo '<h2>Matching Test:</h2>';
    if (is_array($custom_cookies) && is_array($cookie_categories)) {
        foreach ($custom_cookies as $cookie) {
            echo '<p>Cookie: ' . esc_html($cookie['name']) . ' (Category ID: ' . esc_html($cookie['category']) . ')</p>';
            
            // Try to find matching category
            $matched = false;
            foreach ($cookie_categories as $category) {
                if (isset($category['id']) && $category['id'] === $cookie['category']) {
                    echo '<p style="color: green;">✓ Matched with category: ' . esc_html($category['name']) . ' (ID: ' . esc_html($category['id']) . ')</p>';
                    $matched = true;
                    break;
                }
            }
            
            if (!$matched) {
                echo '<p style="color: red;">✗ No matching category found</p>';
            }
        }
    } else {
        echo '<p>No valid data found</p>';
    }
    
    echo '</div>';
}
?>