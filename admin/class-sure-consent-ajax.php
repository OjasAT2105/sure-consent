<?php

/**
 * AJAX handlers for SureConsent plugin
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/admin
 */

class Sure_Consent_Ajax {

    /**
     * Initialize AJAX handlers
     */
    public static function init() {
        add_action('wp_ajax_sure_consent_save_all_settings', array(__CLASS__, 'save_all_settings'));
        add_action('wp_ajax_sure_consent_toggle_banner', array(__CLASS__, 'toggle_banner'));
        add_action('wp_ajax_sure_consent_toggle_preview', array(__CLASS__, 'toggle_preview'));
        add_action('wp_ajax_sure_consent_get_banner_status', array(__CLASS__, 'get_banner_status'));
        add_action('wp_ajax_sure_consent_get_settings', array(__CLASS__, 'get_settings'));
        add_action('wp_ajax_sure_consent_get_public_settings', array(__CLASS__, 'get_public_settings'));
        add_action('wp_ajax_nopriv_sure_consent_get_public_settings', array(__CLASS__, 'get_public_settings'));
        // Add new action for fetching consent logs
        add_action('wp_ajax_sure_consent_get_consent_logs', array(__CLASS__, 'get_consent_logs'));
        // Add new action for generating PDF
        add_action('wp_ajax_sure_consent_generate_consent_pdf', array(__CLASS__, 'generate_consent_pdf'));
        // Add new action for fetching unique countries
        add_action('wp_ajax_sure_consent_get_unique_countries', array(__CLASS__, 'get_unique_countries'));
    }

    /**
     * Save all settings including preview banner
     */
    public static function save_all_settings() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        $settings_data = json_decode(stripslashes($_POST['settings']), true);
        
        if (!is_array($settings_data)) {
            wp_send_json_error('Invalid settings data');
        }

        error_log('SureConsent - save_all_settings called with data: ' . print_r($settings_data, true));

        $updated = array();
        
        // Save directly as options for immediate access
        foreach ($settings_data as $key => $value) {
            $option_name = 'sure_consent_' . $key;
            
            error_log('SureConsent - Processing setting: ' . $key . ' with value: ' . print_r($value, true));
            
            // Handle cookie_categories as JSON (special case)
            if ($key === 'cookie_categories' && is_array($value)) {
                $json_value = json_encode($value);
                update_option($option_name, $json_value); // Use update_option instead of add/delete
                error_log('SureConsent - Saving cookie_categories as JSON: ' . $json_value);
                $updated[$key] = $value;
            } 
            // Handle custom_cookies as JSON (special case)
            else if ($key === 'custom_cookies' && is_array($value)) {
                $json_value = json_encode($value);
                update_option($option_name, $json_value);
                error_log('SureConsent - Saving custom_cookies as JSON: ' . $json_value);
                error_log('SureConsent - custom_cookies data type: ' . gettype($value));
                error_log('SureConsent - custom_cookies content: ' . print_r($value, true));
                $updated[$key] = $value;
            }
            // Handle preview_enabled as boolean
            else if ($key === 'preview_enabled') {
                update_option($option_name, (bool) $value);
                $updated[$key] = (bool) $value;
            } 
            // Handle all other settings
            else {
                update_option($option_name, $value);
                $updated[$key] = $value;
                
                // Also update through settings class if it exists (except for special cases)
                if (class_exists('Sure_Consent_Settings') && $key !== 'cookie_categories' && $key !== 'custom_cookies') {
                    Sure_Consent_Settings::update_setting($key, $value);
                }
            }
            
            $saved_value = get_option($option_name);
            error_log('SureConsent - Saved: ' . $option_name . ' = ' . print_r($value, true) . ' (verified: ' . print_r($saved_value, true) . ')');
        }

        error_log('SureConsent - save_all_settings completed. Updated settings: ' . print_r($updated, true));

        wp_send_json_success(array(
            'message' => 'All settings saved successfully',
            'settings' => $updated
        ));
    }

    /**
     * Get admin settings
     */
    public static function get_settings() {
        error_log('=== SureConsent - get_settings called (ADMIN) ===');
        error_log('SureConsent - get_settings called');
        
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Debug: Check what's actually in the database
        $banner_bg_color_value = get_option('sure_consent_banner_bg_color', '#1f2937');
        error_log('SureConsent - Getting banner_bg_color: ' . print_r($banner_bg_color_value, true));
        
        // Debug cookie_categories specifically
        $cookie_categories_raw = get_option('sure_consent_cookie_categories', '[]');
        error_log('SureConsent - cookie_categories RAW from DB: ' . $cookie_categories_raw);
        $cookie_categories_decoded = json_decode($cookie_categories_raw, true);
        error_log('SureConsent - cookie_categories DECODED: ' . print_r($cookie_categories_decoded, true));
        error_log('SureConsent - cookie_categories IS ARRAY?: ' . (is_array($cookie_categories_decoded) ? 'YES' : 'NO'));
        error_log('SureConsent - cookie_categories COUNT: ' . (is_array($cookie_categories_decoded) ? count($cookie_categories_decoded) : '0'));
        
        // Get custom cookies
        $custom_cookies_raw = get_option('sure_consent_custom_cookies', '[]');
        error_log('SureConsent - custom_cookies RAW from DB: ' . $custom_cookies_raw);
        
        // Handle potential JSON decoding errors
        $custom_cookies_decoded = array();
        if (!empty($custom_cookies_raw)) {
            $custom_cookies_decoded = json_decode($custom_cookies_raw, true);
            // If json_decode fails, it returns null
            if ($custom_cookies_decoded === null) {
                error_log('SureConsent - ERROR: Failed to decode custom_cookies JSON: ' . json_last_error_msg());
                $custom_cookies_decoded = array();
            }
        }
        
        error_log('SureConsent - custom_cookies DECODED: ' . print_r($custom_cookies_decoded, true));
        error_log('SureConsent - custom_cookies IS ARRAY?: ' . (is_array($custom_cookies_decoded) ? 'YES' : 'NO'));
        error_log('SureConsent - custom_cookies COUNT: ' . (is_array($custom_cookies_decoded) ? count($custom_cookies_decoded) : '0'));
        
        // Ensure cookie_categories is properly formatted
        $processed_cookie_categories = array();
        if (is_array($cookie_categories_decoded)) {
            $processed_cookie_categories = $cookie_categories_decoded;
        }
        
        // Ensure custom_cookies is properly formatted
        $processed_custom_cookies = array();
        if (is_array($custom_cookies_decoded)) {
            $processed_custom_cookies = $custom_cookies_decoded;
        }
        
        $settings = array(
            'message_heading' => (string) get_option('sure_consent_message_heading', ''),
            'message_description' => (string) get_option('sure_consent_message_description', 'We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies. You can learn more about how we use cookies in our Privacy Policy.'),
            'notice_type' => (string) get_option('sure_consent_notice_type', 'banner'),
            'notice_position' => (string) get_option('sure_consent_notice_position', 'bottom'),
            'preview_enabled' => (bool) get_option('sure_consent_preview_enabled', false),
            'enable_banner' => (bool) get_option('sure_consent_enable_banner', false),
            'show_preview' => (bool) get_option('sure_consent_show_preview', false),
            'banner_bg_color' => (string) $banner_bg_color_value,
            'bg_opacity' => (string) get_option('sure_consent_bg_opacity', '100'),
            'text_color' => (string) get_option('sure_consent_text_color', '#ffffff'),
            'border_style' => (string) get_option('sure_consent_border_style', 'solid'),
            'border_width' => (string) get_option('sure_consent_border_width', '1'),
            'border_color' => (string) get_option('sure_consent_border_color', '#000000'),
            'border_radius' => (string) get_option('sure_consent_border_radius', '8'),
            'font' => (string) get_option('sure_consent_font', 'Arial'),
            'banner_logo' => (string) get_option('sure_consent_banner_logo', ''),
            'accept_btn_color' => (string) get_option('sure_consent_accept_btn_color', '#2563eb'),
            'decline_btn_color' => (string) get_option('sure_consent_decline_btn_color', 'transparent'),
            'preferences_btn_text' => (string) get_option('sure_consent_preferences_btn_text', 'Preferences'),
            'preferences_btn_color' => (string) get_option('sure_consent_preferences_btn_color', 'transparent'),
            'preferences_btn_text_color' => (string) get_option('sure_consent_preferences_btn_text_color', '#2563eb'),
            'preferences_btn_show_as' => (string) get_option('sure_consent_preferences_btn_show_as', 'button'),
            'preferences_btn_bg_opacity' => (string) get_option('sure_consent_preferences_btn_bg_opacity', '100'),
            'preferences_btn_border_style' => (string) get_option('sure_consent_preferences_btn_border_style', 'solid'),
            'preferences_btn_border_color' => (string) get_option('sure_consent_preferences_btn_border_color', '#2563eb'),
            'preferences_btn_border_width' => (string) get_option('sure_consent_preferences_btn_border_width', '1'),
            'preferences_btn_border_radius' => (string) get_option('sure_consent_preferences_btn_border_radius', '4'),
            'custom_css' => (string) get_option('sure_consent_custom_css', ''),
            'banner_design_template' => (string) get_option('sure_consent_banner_design_template', 'default'),
            'cookie_categories' => $processed_cookie_categories,
            'custom_cookies' => $processed_custom_cookies
        );
        
        error_log('SureConsent - Final settings array: ' . print_r($settings, true));
        error_log('SureConsent - cookie_categories from DB: ' . get_option('sure_consent_cookie_categories', '[]'));
        error_log('SureConsent - custom_cookies from DB: ' . get_option('sure_consent_custom_cookies', '[]'));
        error_log('SureConsent - Sending settings response: ' . print_r($settings, true));
        wp_send_json_success($settings);
    }

    /**
     * Toggle banner status
     */
    public static function toggle_banner() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        $enabled = sanitize_text_field($_POST['enabled']);
        // Update both banner_enabled and enable_banner for backward compatibility
        update_option('sure_consent_banner_enabled', $enabled === '1');
        update_option('sure_consent_enable_banner', $enabled === '1');

        wp_send_json_success(array('enabled' => $enabled === '1'));
    }

    /**
     * Toggle preview status
     */
    public static function toggle_preview() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        $enabled = sanitize_text_field($_POST['enabled']);
        update_option('sure_consent_preview_enabled', $enabled === '1');

        wp_send_json_success(array('preview' => $enabled === '1'));
    }

    /**
     * Get banner status
     */
    public static function get_banner_status() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Check both banner_enabled and enable_banner for backward compatibility
        $enabled = get_option('sure_consent_banner_enabled', false) || get_option('sure_consent_enable_banner', false);
        $preview = get_option('sure_consent_preview_enabled', false);
        wp_send_json_success(array('enabled' => (bool) $enabled, 'preview' => (bool) $preview));
    }

    /**
     * Get public settings (no auth required)
     */
    public static function get_public_settings() {
        // Allow public access - check nonce only if provided
        if (isset($_POST['nonce']) && !empty($_POST['nonce'])) {
            if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
                wp_die('Security check failed');
            }
        }

        $notice_type = get_option('sure_consent_notice_type', 'banner');
        $notice_position = get_option('sure_consent_notice_position', 'bottom');
        // Check both banner_enabled and enable_banner for backward compatibility
        $banner_enabled = get_option('sure_consent_banner_enabled', false) || get_option('sure_consent_enable_banner', false);
        
        error_log('SureConsent - Getting public settings: notice_type=' . $notice_type . ', notice_position=' . $notice_position . ', enabled=' . ($banner_enabled ? 'true' : 'false'));

        // Get cookie categories
        $cookie_categories_raw = get_option('sure_consent_cookie_categories', '[]');
        error_log('SureConsent - public cookie_categories RAW from DB: ' . $cookie_categories_raw);
        $cookie_categories_decoded = json_decode($cookie_categories_raw, true);
        error_log('SureConsent - public cookie_categories DECODED: ' . print_r($cookie_categories_decoded, true));
        
        // Get custom cookies
        $custom_cookies_raw = get_option('sure_consent_custom_cookies', '[]');
        error_log('SureConsent - public custom_cookies RAW from DB: ' . $custom_cookies_raw);
        
        // Handle potential JSON decoding errors
        $custom_cookies_decoded = array();
        if (!empty($custom_cookies_raw)) {
            $custom_cookies_decoded = json_decode($custom_cookies_raw, true);
            // If json_decode fails, it returns null
            if ($custom_cookies_decoded === null) {
                error_log('SureConsent - ERROR: Failed to decode public custom_cookies JSON: ' . json_last_error_msg());
                $custom_cookies_decoded = array();
            }
        }
        
        error_log('SureConsent - public custom_cookies DECODED: ' . print_r($custom_cookies_decoded, true));
        
        // Ensure cookie_categories is properly formatted
        $processed_cookie_categories = array();
        if (is_array($cookie_categories_decoded)) {
            $processed_cookie_categories = $cookie_categories_decoded;
        }
        
        // Ensure custom_cookies is properly formatted
        $processed_custom_cookies = array();
        if (is_array($custom_cookies_decoded)) {
            $processed_custom_cookies = $custom_cookies_decoded;
        }

        $settings = array(
            'message_heading' => (string) get_option('sure_consent_message_heading', ''),
            'message_description' => (string) get_option('sure_consent_message_description', 'We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies. You can learn more about how we use cookies in our Privacy Policy.'),
            'notice_type' => (string) $notice_type,
            'notice_position' => (string) $notice_position,
            'banner_enabled' => (bool) $banner_enabled,
            'banner_bg_color' => (string) get_option('sure_consent_banner_bg_color', '#1f2937'),
            'bg_opacity' => (string) get_option('sure_consent_bg_opacity', '100'),
            'text_color' => (string) get_option('sure_consent_text_color', '#ffffff'),
            'border_style' => (string) get_option('sure_consent_border_style', 'solid'),
            'border_width' => (string) get_option('sure_consent_border_width', '1'),
            'border_color' => (string) get_option('sure_consent_border_color', '#000000'),
            'border_radius' => (string) get_option('sure_consent_border_radius', '8'),
            'font' => (string) get_option('sure_consent_font', 'Arial'),
            'banner_logo' => (string) get_option('sure_consent_banner_logo', ''),
            'accept_btn_color' => (string) get_option('sure_consent_accept_btn_color', '#2563eb'),
            'accept_btn_text' => (string) get_option('sure_consent_accept_btn_text', 'Accept'),
            'accept_btn_text_color' => (string) get_option('sure_consent_accept_btn_text_color', '#ffffff'),
            'accept_btn_show_as' => (string) get_option('sure_consent_accept_btn_show_as', 'button'),
            'accept_btn_bg_opacity' => (string) get_option('sure_consent_accept_btn_bg_opacity', '100'),
            'accept_btn_border_style' => (string) get_option('sure_consent_accept_btn_border_style', 'none'),
            'accept_btn_border_color' => (string) get_option('sure_consent_accept_btn_border_color', '#000000'),
            'accept_btn_border_width' => (string) get_option('sure_consent_accept_btn_border_width', '1'),
            'accept_btn_border_radius' => (string) get_option('sure_consent_accept_btn_border_radius', '4'),
            'accept_all_enabled' => (bool) get_option('sure_consent_accept_all_enabled', false),
            'accept_all_btn_text' => (string) get_option('sure_consent_accept_all_btn_text', 'Accept All'),
            'accept_all_btn_text_color' => (string) get_option('sure_consent_accept_all_btn_text_color', '#ffffff'),
            'accept_all_btn_show_as' => (string) get_option('sure_consent_accept_all_btn_show_as', 'button'),
            'accept_all_btn_bg_color' => (string) get_option('sure_consent_accept_all_btn_bg_color', '#2563eb'),
            'accept_all_btn_bg_opacity' => (string) get_option('sure_consent_accept_all_btn_bg_opacity', '100'),
            'accept_all_btn_border_style' => (string) get_option('sure_consent_accept_all_btn_border_style', 'none'),
            'accept_all_btn_border_color' => (string) get_option('sure_consent_accept_all_btn_border_color', '#000000'),
            'accept_all_btn_border_width' => (string) get_option('sure_consent_accept_all_btn_border_width', '1'),
            'accept_all_btn_border_radius' => (string) get_option('sure_consent_accept_all_btn_border_radius', '4'),
            'decline_btn_color' => (string) get_option('sure_consent_decline_btn_color', 'transparent'),
            'decline_btn_text' => (string) get_option('sure_consent_decline_btn_text', 'Decline'),
            'decline_btn_text_color' => (string) get_option('sure_consent_decline_btn_text_color', '#000000'),
            'decline_btn_show_as' => (string) get_option('sure_consent_decline_btn_show_as', 'button'),
            'decline_btn_bg_opacity' => (string) get_option('sure_consent_decline_btn_bg_opacity', '100'),
            'decline_btn_border_style' => (string) get_option('sure_consent_decline_btn_border_style', 'solid'),
            'decline_btn_border_color' => (string) get_option('sure_consent_decline_btn_border_color', '#6b7280'),
            'decline_btn_border_width' => (string) get_option('sure_consent_decline_btn_border_width', '1'),
            'decline_btn_border_radius' => (string) get_option('sure_consent_decline_btn_border_radius', '4'),
            'preferences_btn_text' => (string) get_option('sure_consent_preferences_btn_text', 'Preferences'),
            'preferences_btn_color' => (string) get_option('sure_consent_preferences_btn_color', 'transparent'),
            'preferences_btn_text_color' => (string) get_option('sure_consent_preferences_btn_text_color', '#2563eb'),
            'preferences_btn_show_as' => (string) get_option('sure_consent_preferences_btn_show_as', 'button'),
            'preferences_btn_bg_opacity' => (string) get_option('sure_consent_preferences_btn_bg_opacity', '100'),
            'preferences_btn_border_style' => (string) get_option('sure_consent_preferences_btn_border_style', 'solid'),
            'preferences_btn_border_color' => (string) get_option('sure_consent_preferences_btn_border_color', '#2563eb'),
            'preferences_btn_border_width' => (string) get_option('sure_consent_preferences_btn_border_width', '1'),
            'preferences_btn_border_radius' => (string) get_option('sure_consent_preferences_btn_border_radius', '4'),
            'button_order' => (string) get_option('sure_consent_button_order', 'decline,preferences,accept,accept_all'),
            'custom_css' => (string) get_option('sure_consent_custom_css', ''),
            'cookie_categories' => $processed_cookie_categories,
            'custom_cookies' => $processed_custom_cookies
        );
        
        wp_send_json_success($settings);
    }

    /**
     * Get consent logs with filtering and pagination
     */
    public static function get_consent_logs() {
        error_log("SureConsent - get_consent_logs AJAX handler called");
        
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            error_log("SureConsent - Nonce verification failed");
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            error_log("SureConsent - Insufficient permissions");
            wp_die('Insufficient permissions');
        }

        // Forward the request to the storage class
        if (class_exists('Sure_Consent_Storage')) {
            error_log("SureConsent - Forwarding to storage class");
            Sure_Consent_Storage::get_consent_logs();
        } else {
            error_log("SureConsent - Storage class not found");
            wp_send_json_error(array('message' => 'Storage class not found'));
        }
    }

    /**
     * Generate PDF for a consent log
     */
    public static function generate_consent_pdf() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Forward the request to the storage class
        if (class_exists('Sure_Consent_Storage')) {
            Sure_Consent_Storage::generate_consent_pdf();
        } else {
            wp_send_json_error(array('message' => 'Storage class not found'));
        }
    }

    /**
     * Get all unique countries from consent logs
     */
    public static function get_unique_countries() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Forward the request to the storage class
        if (class_exists('Sure_Consent_Storage')) {
            Sure_Consent_Storage::get_unique_countries();
        } else {
            wp_send_json_error(array('message' => 'Storage class not found'));
        }
    }
}

// Initialize AJAX handlers
Sure_Consent_Ajax::init();