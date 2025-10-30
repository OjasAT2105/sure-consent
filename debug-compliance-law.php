<?php
/**
 * Plugin Name: SureConsent Debug Compliance Law
 * Description: Debug tool to check compliance law settings
 * Version: 1.0
 */

// Add admin menu
add_action('admin_menu', 'sc_debug_add_admin_menu');

function sc_debug_add_admin_menu() {
    add_management_page(
        'SureConsent Debug',
        'SureConsent Debug',
        'manage_options',
        'sureconsent-debug',
        'sc_debug_page'
    );
}

function sc_debug_page() {
    echo '<div class="wrap">';
    echo '<h1>SureConsent Debug</h1>';
    
    echo '<h2>Compliance Law Settings</h2>';
    
    // Check the current compliance law setting
    $compliance_law = get_option('sure_consent_compliance_law');
    echo '<p>Raw compliance law value:</p>';
    echo '<pre>' . print_r($compliance_law, true) . '</pre>';
    
    // Check if it's a serialized value
    if (is_string($compliance_law)) {
        $unserialized = @unserialize($compliance_law);
        if ($unserialized !== false) {
            echo '<p>Unserialized value:</p>';
            echo '<pre>' . print_r($unserialized, true) . '</pre>';
        }
    }
    
    // Check all sure_consent options that might relate to compliance
    echo '<h2>All SureConsent Options</h2>';
    global $wpdb;
    $results = $wpdb->get_results("SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE 'sure_consent_%'");
    echo '<table class="widefat">';
    echo '<thead><tr><th>Option Name</th><th>Option Value</th></tr></thead>';
    echo '<tbody>';
    foreach ($results as $row) {
        if (strpos($row->option_name, 'compliance') !== false || strpos($row->option_name, 'law') !== false) {
            echo '<tr>';
            echo '<td>' . esc_html($row->option_name) . '</td>';
            echo '<td><pre>' . esc_html(print_r(maybe_unserialize($row->option_value), true)) . '</pre></td>';
            echo '</tr>';
        }
    }
    echo '</tbody></table>';
    
    echo '</div>';
}
?>