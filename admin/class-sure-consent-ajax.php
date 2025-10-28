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
        // Add new actions for deleting consent logs
        add_action('wp_ajax_sure_consent_delete_consent_log', array(__CLASS__, 'delete_consent_log'));
        add_action('wp_ajax_sure_consent_delete_all_consent_logs', array(__CLASS__, 'delete_all_consent_logs'));
        // Add new actions for cookie scanning
        add_action('wp_ajax_sure_consent_scan_cookies', array(__CLASS__, 'scan_cookies'));
        add_action('wp_ajax_sure_consent_get_scanned_cookies', array(__CLASS__, 'get_scanned_cookies'));
        add_action('wp_ajax_sure_consent_update_scanned_cookie', array(__CLASS__, 'update_scanned_cookie'));
        add_action('wp_ajax_sure_consent_delete_scanned_cookie', array(__CLASS__, 'delete_scanned_cookie'));
        // Add new actions for scan history
        add_action('wp_ajax_sure_consent_get_scan_history', array(__CLASS__, 'get_scan_history'));
        add_action('wp_ajax_sure_consent_get_scan_history_record', array(__CLASS__, 'get_scan_history_record'));
        add_action('wp_ajax_sure_consent_delete_scan_history_record', array(__CLASS__, 'delete_scan_history_record'));
        add_action('wp_ajax_sure_consent_export_scan_history_csv', array(__CLASS__, 'export_scan_history_csv'));
        add_action('wp_ajax_sure_consent_export_scan_history_json', array(__CLASS__, 'export_scan_history_json'));
        // Add new actions for scheduled scans
        add_action('wp_ajax_sure_consent_save_scheduled_scan', array(__CLASS__, 'save_scheduled_scan'));
        add_action('wp_ajax_sure_consent_get_scheduled_scans', array(__CLASS__, 'get_scheduled_scans'));
        add_action('wp_ajax_sure_consent_delete_scheduled_scan', array(__CLASS__, 'delete_scheduled_scan'));
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
            // Handle geo_selected_countries as JSON (special case)
            else if ($key === 'geo_selected_countries' && is_array($value)) {
                $json_value = json_encode($value);
                update_option($option_name, $json_value);
                error_log('SureConsent - Saving geo_selected_countries as JSON: ' . $json_value);
                $updated[$key] = $value;
            }
            // Handle preview_enabled as boolean
            else if ($key === 'preview_enabled') {
                update_option($option_name, (bool) $value);
                $updated[$key] = (bool) $value;
            } 
            // Handle consent_duration_days as integer
            else if ($key === 'consent_duration_days') {
                $duration = (int) $value;
                // Ensure duration is between 1 and 3650
                if ($duration < 1) $duration = 1;
                if ($duration > 3650) $duration = 3650;
                update_option($option_name, $duration);
                $updated[$key] = $duration;
            }
            // Handle all other settings
            else {
                update_option($option_name, $value);
                $updated[$key] = $value;
                
                // Also update through settings class if it exists (except for special cases)
                if (class_exists('Sure_Consent_Settings') && $key !== 'cookie_categories' && $key !== 'custom_cookies' && $key !== 'geo_selected_countries') {
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
        
        // Get geo settings
        $geo_selected_countries_raw = get_option('sure_consent_geo_selected_countries', '[]');
        error_log('SureConsent - geo_selected_countries RAW from DB: ' . $geo_selected_countries_raw);
        
        // Handle potential JSON decoding errors
        $geo_selected_countries_decoded = array();
        if (!empty($geo_selected_countries_raw)) {
            $geo_selected_countries_decoded = json_decode($geo_selected_countries_raw, true);
            // If json_decode fails, it returns null
            if ($geo_selected_countries_decoded === null) {
                error_log('SureConsent - ERROR: Failed to decode geo_selected_countries JSON: ' . json_last_error_msg());
                $geo_selected_countries_decoded = array();
            }
        }
        
        error_log('SureConsent - geo_selected_countries DECODED: ' . print_r($geo_selected_countries_decoded, true));
        error_log('SureConsent - geo_selected_countries IS ARRAY?: ' . (is_array($geo_selected_countries_decoded) ? 'YES' : 'NO'));
        error_log('SureConsent - geo_selected_countries COUNT: ' . (is_array($geo_selected_countries_decoded) ? count($geo_selected_countries_decoded) : '0'));
        
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
        
        // Ensure geo_selected_countries is properly formatted
        $processed_geo_selected_countries = array();
        if (is_array($geo_selected_countries_decoded)) {
            $processed_geo_selected_countries = $geo_selected_countries_decoded;
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
            'custom_cookies' => $processed_custom_cookies,
            'consent_duration_days' => (int) get_option('sure_consent_consent_duration_days', 365),  // Add consent duration setting
            'geo_rule_type' => (string) get_option('sure_consent_geo_rule_type', 'worldwide'),  // Geo rule type
            'geo_selected_countries' => $processed_geo_selected_countries  // Selected countries for geo-targeting
        );
        
        error_log('SureConsent - Final settings array: ' . print_r($settings, true));
        error_log('SureConsent - cookie_categories from DB: ' . get_option('sure_consent_cookie_categories', '[]'));
        error_log('SureConsent - custom_cookies from DB: ' . get_option('sure_consent_custom_cookies', '[]'));
        error_log('SureConsent - geo_selected_countries from DB: ' . get_option('sure_consent_geo_selected_countries', '[]'));
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
        
        // Get geo settings
        $geo_rule_type = get_option('sure_consent_geo_rule_type', 'worldwide');
        $geo_selected_countries_raw = get_option('sure_consent_geo_selected_countries', '[]');
        error_log('SureConsent - public geo_selected_countries RAW from DB: ' . $geo_selected_countries_raw);
        
        // Handle potential JSON decoding errors
        $geo_selected_countries_decoded = array();
        if (!empty($geo_selected_countries_raw)) {
            $geo_selected_countries_decoded = json_decode($geo_selected_countries_raw, true);
            // If json_decode fails, it returns null
            if ($geo_selected_countries_decoded === null) {
                error_log('SureConsent - ERROR: Failed to decode public geo_selected_countries JSON: ' . json_last_error_msg());
                $geo_selected_countries_decoded = array();
            }
        }
        
        error_log('SureConsent - public geo_selected_countries DECODED: ' . print_r($geo_selected_countries_decoded, true));
        
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
        
        // Ensure geo_selected_countries is properly formatted
        $processed_geo_selected_countries = array();
        if (is_array($geo_selected_countries_decoded)) {
            $processed_geo_selected_countries = $geo_selected_countries_decoded;
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
            'custom_cookies' => $processed_custom_cookies,
            'consent_duration_days' => (int) get_option('sure_consent_consent_duration_days', 365),  // Add consent duration setting
            'geo_rule_type' => (string) $geo_rule_type,  // Geo rule type
            'geo_selected_countries' => $processed_geo_selected_countries  // Selected countries for geo-targeting
        );
        
        wp_send_json_success($settings);
    }

    /**
     * Get consent logs with pagination (removed filter functionality)
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
            wp_die('Storage class not found');
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

    /**
     * Delete a single consent log
     */
    public static function delete_consent_log() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        $log_id = isset($_POST['log_id']) ? intval($_POST['log_id']) : 0;
        
        if (!$log_id) {
            wp_send_json_error(array('message' => 'Invalid log ID'));
            return;
        }

        // Forward the request to the storage class
        if (class_exists('Sure_Consent_Storage')) {
            $result = Sure_Consent_Storage::delete_consent_log($log_id);
            if ($result) {
                wp_send_json_success(array('message' => 'Log deleted successfully'));
            } else {
                wp_send_json_error(array('message' => 'Failed to delete log'));
            }
        } else {
            wp_send_json_error(array('message' => 'Storage class not found'));
        }
    }

    /**
     * Delete all consent logs
     */
    public static function delete_all_consent_logs() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Forward the request to the storage class
        if (class_exists('Sure_Consent_Storage')) {
            $result = Sure_Consent_Storage::delete_all_consent_logs();
            if ($result !== false) {
                wp_send_json_success(array('message' => 'All logs deleted successfully', 'deleted_count' => $result));
            } else {
                wp_send_json_error(array('message' => 'Failed to delete logs'));
            }
        } else {
            wp_send_json_error(array('message' => 'Storage class not found'));
        }
    }

    /**
     * Get all published pages and posts URLs from WordPress
     */
    public static function get_all_site_urls() {
        // Get all published posts
        $posts = get_posts(array(
            'post_type' => 'post',
            'post_status' => 'publish',
            'numberposts' => -1,
            'fields' => 'ids'
        ));
        
        // Get all published pages
        $pages = get_posts(array(
            'post_type' => 'page',
            'post_status' => 'publish',
            'numberposts' => -1,
            'fields' => 'ids'
        ));
        
        // Get all public post types
        $post_types = get_post_types(array('public' => true));
        $all_posts = array();
        
        foreach ($post_types as $post_type) {
            if ($post_type !== 'post' && $post_type !== 'page' && $post_type !== 'attachment') {
                $custom_posts = get_posts(array(
                    'post_type' => $post_type,
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'fields' => 'ids'
                ));
                $all_posts = array_merge($all_posts, $custom_posts);
            }
        }
        
        // Combine all posts
        $all_content_ids = array_merge($posts, $pages, $all_posts);
        
        // Get URLs
        $urls = array();
        foreach ($all_content_ids as $post_id) {
            $urls[] = get_permalink($post_id);
        }
        
        // Add homepage
        $urls[] = home_url();
        
        // Remove duplicates and invalid URLs
        $urls = array_filter(array_unique($urls), function($url) {
            return filter_var($url, FILTER_VALIDATE_URL) !== false;
        });
        
        return array_values($urls);
    }

    /**
     * Scan cookies using Puppeteer for comprehensive detection including third-party cookies
     */
    public static function scan_cookies_with_puppeteer($url) {
        // Path to the Node.js script
        $script_path = plugin_dir_path(__FILE__) . '../puppeteer-scan.js';
        $results_path = plugin_dir_path(__FILE__) . '../puppeteer-results.json';
        
        // Remove previous results if they exist
        if (file_exists($results_path)) {
            unlink($results_path);
        }
        
        // Execute the Node.js script
        $command = 'node ' . escapeshellarg($script_path) . ' ' . escapeshellarg($url) . ' 2>&1';
        $output = shell_exec($command);
        
        // Check if results file was created
        if (file_exists($results_path)) {
            $results = file_get_contents($results_path);
            $cookies = json_decode($results, true);
            
            // Remove the results file
            unlink($results_path);
            
            if (is_array($cookies)) {
                return $cookies;
            }
        }
        
        // Return empty array if no results
        return array();
    }

    /**
     * Scan cookies using Puppeteer for multiple URLs
     */
    public static function scan_cookies_with_puppeteer_multiple($urls) {
        // Path to the Node.js script
        $script_path = plugin_dir_path(__FILE__) . '../puppeteer-scan.js';
        $results_path = plugin_dir_path(__FILE__) . '../puppeteer-results.json';
        
        // Remove previous results if they exist
        if (file_exists($results_path)) {
            unlink($results_path);
        }
        
        // Prepare URLs for command line (limit to 50 URLs to prevent command line overflow)
        $urls = array_slice($urls, 0, 50);
        $url_args = array_map('escapeshellarg', $urls);
        $urls_string = implode(' ', $url_args);
        
        // Execute the Node.js script with multiple URLs
        $command = 'node ' . escapeshellarg($script_path) . ' ' . $urls_string . ' 2>&1';
        $output = shell_exec($command);
        
        // Check if results file was created
        if (file_exists($results_path)) {
            $results = file_get_contents($results_path);
            $cookies = json_decode($results, true);
            
            // Remove the results file
            unlink($results_path);
            
            if (is_array($cookies)) {
                return $cookies;
            }
        }
        
        // Return empty array if no results
        return array();
    }

    /**
     * Scan cookies and save to database
     */
    public static function scan_cookies() {
        error_log('SureConsent - scan_cookies function called');
        
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            error_log('SureConsent - Security check failed in scan_cookies');
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            error_log('SureConsent - Insufficient permissions in scan_cookies');
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }

        // Get scanned cookies data
        $scanned_cookies = isset($_POST['cookies']) ? json_decode(stripslashes($_POST['cookies']), true) : array();
        $scan_all_pages = isset($_POST['scan_all']) ? (bool) $_POST['scan_all'] : false;
        
        error_log('SureConsent - Scan all pages: ' . ($scan_all_pages ? 'true' : 'false'));
        
        if (!is_array($scanned_cookies)) {
            error_log('SureConsent - Invalid cookie data in scan_cookies');
            wp_send_json_error(array('message' => 'Invalid cookie data'));
            return;
        }

        // If scanning all pages, get all URLs and perform comprehensive scan
        if ($scan_all_pages) {
            error_log('SureConsent - Getting all site URLs for scan');
            $all_urls = self::get_all_site_urls();
            error_log('SureConsent - Found ' . count($all_urls) . ' URLs to scan');
            error_log('SureConsent - URLs: ' . print_r($all_urls, true));
            
            error_log('SureConsent - Starting Puppeteer scan for all pages');
            $puppeteer_cookies = self::scan_cookies_with_puppeteer_multiple($all_urls);
            error_log('SureConsent - Puppeteer scan completed, found ' . count($puppeteer_cookies) . ' cookies');
        } else {
            // Single page scan as before
            error_log('SureConsent - Starting single page scan');
            $website_url = isset($_POST['url']) ? sanitize_text_field($_POST['url']) : home_url();
            $puppeteer_cookies = self::scan_cookies_with_puppeteer($website_url);
            error_log('SureConsent - Single page scan completed, found ' . count($puppeteer_cookies) . ' cookies');
        }
        
        // Merge client and server cookies
        $all_cookies = array_merge($scanned_cookies, $puppeteer_cookies);
        error_log('SureConsent - Total cookies found before adding custom cookies: ' . count($all_cookies));

        // Get custom cookies from settings and add them to the scan results
        $custom_cookies_raw = get_option('sure_consent_custom_cookies', '[]');
        $custom_cookies = json_decode($custom_cookies_raw, true);
        
        // If json_decode fails, initialize as empty array
        if ($custom_cookies === null) {
            $custom_cookies = array();
        }
        
        error_log('SureConsent - Found ' . count($custom_cookies) . ' custom cookies to include in scan');
        
        // Convert custom cookies to the same format as scanned cookies
        $formatted_custom_cookies = array();
        foreach ($custom_cookies as $custom_cookie) {
            $formatted_custom_cookies[] = array(
                'name' => isset($custom_cookie['name']) ? sanitize_text_field($custom_cookie['name']) : '',
                'value' => '', // Custom cookies don't have actual values in scanning
                'domain' => isset($custom_cookie['domain']) ? sanitize_text_field($custom_cookie['domain']) : window.location.hostname,
                'path' => '/',
                'expires' => isset($custom_cookie['expires']) ? sanitize_text_field($custom_cookie['expires']) : null,
                'category' => isset($custom_cookie['category']) ? sanitize_text_field($custom_cookie['category']) : 'Uncategorized',
                'note' => isset($custom_cookie['description']) ? 'Custom cookie: ' . sanitize_text_field($custom_cookie['description']) : 'Custom cookie'
            );
        }
        
        // Merge custom cookies with scanned cookies
        $all_cookies = array_merge($all_cookies, $formatted_custom_cookies);
        error_log('SureConsent - Total cookies after adding custom cookies: ' . count($all_cookies));

        global $wpdb;
        $table_name = $wpdb->prefix . 'sure_consent_scanned_cookies';

        // First, delete all existing scanned cookies
        error_log('SureConsent - Clearing existing scanned cookies');
        $wpdb->query("TRUNCATE TABLE $table_name");

        // Insert new scanned cookies
        error_log('SureConsent - Inserting ' . count($all_cookies) . ' cookies into database');
        foreach ($all_cookies as $cookie) {
            $wpdb->insert(
                $table_name,
                array(
                    'cookie_name' => sanitize_text_field($cookie['name']),
                    'cookie_value' => sanitize_text_field($cookie['value']),
                    'domain' => sanitize_text_field($cookie['domain']),
                    'path' => sanitize_text_field($cookie['path']),
                    'expires' => !empty($cookie['expires']) ? date('Y-m-d H:i:s', strtotime($cookie['expires'])) : null,
                    'category' => sanitize_text_field($cookie['category']),
                    'note' => isset($cookie['note']) ? sanitize_text_field($cookie['note']) : ''
                ),
                array(
                    '%s', // cookie_name
                    '%s', // cookie_value
                    '%s', // domain
                    '%s', // path
                    '%s', // expires
                    '%s', // category
                    '%s'  // note
                )
            );
        }
        
        // Save scan history
        $scan_type = $scan_all_pages ? 'all_pages' : 'current_page';
        $pages_scanned = $scan_all_pages ? count(self::get_all_site_urls()) : 1;
        $total_cookies = count($all_cookies);
        
        error_log('SureConsent - Saving scan history: ' . $total_cookies . ' cookies, ' . $pages_scanned . ' pages, type: ' . $scan_type);
        
        // Save to scan history table
        $history_id = Sure_Consent_Storage::save_scan_history($total_cookies, $scan_type, $pages_scanned, $all_cookies);
        error_log('SureConsent - Scan history saved with ID: ' . $history_id);

        wp_send_json_success(array(
            'message' => 'Cookies scanned and saved successfully',
            'count' => count($all_cookies),
            'client_cookies' => count($scanned_cookies),
            'server_cookies' => count($puppeteer_cookies),
            'custom_cookies' => count($formatted_custom_cookies),
            'scanned_pages' => $scan_all_pages ? count(self::get_all_site_urls()) : 1
        ));
    }

    /**
     * Get scanned cookies from database
     */
    public static function get_scanned_cookies() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'sure_consent_scanned_cookies';

        // Get all scanned cookies
        $cookies = $wpdb->get_results("SELECT * FROM $table_name ORDER BY category, cookie_name");

        wp_send_json_success(array(
            'cookies' => $cookies
        ));
    }

    /**
     * Update a scanned cookie
     */
    public static function update_scanned_cookie() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }

        // Get cookie data
        $cookie_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $category = isset($_POST['category']) ? sanitize_text_field($_POST['category']) : '';
        $note = isset($_POST['note']) ? sanitize_text_field($_POST['note']) : '';

        if (empty($cookie_id)) {
            wp_send_json_error(array('message' => 'Invalid cookie ID'));
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'sure_consent_scanned_cookies';

        // Update cookie
        $result = $wpdb->update(
            $table_name,
            array(
                'category' => $category,
                'note' => $note
            ),
            array('id' => $cookie_id),
            array(
                '%s', // category
                '%s'  // note
            ),
            array('%d') // id
        );

        if ($result !== false) {
            wp_send_json_success(array('message' => 'Cookie updated successfully'));
        } else {
            wp_send_json_error(array('message' => 'Failed to update cookie'));
        }
    }

    /**
     * Delete a scanned cookie
     */
    public static function delete_scanned_cookie() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }

        // Get cookie ID
        $cookie_id = isset($_POST['id']) ? intval($_POST['id']) : 0;

        if (empty($cookie_id)) {
            wp_send_json_error(array('message' => 'Invalid cookie ID'));
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'sure_consent_scanned_cookies';

        // Delete cookie
        $result = $wpdb->delete(
            $table_name,
            array('id' => $cookie_id),
            array('%d') // id
        );

        if ($result !== false) {
            wp_send_json_success(array('message' => 'Cookie deleted successfully'));
        } else {
            wp_send_json_error(array('message' => 'Failed to delete cookie'));
        }
    }
    
    /**
     * Get scan history records
     */
    public static function get_scan_history() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }

        // Get pagination parameters
        $page = isset($_POST['page']) ? intval($_POST['page']) : 1;
        $per_page = isset($_POST['per_page']) ? intval($_POST['per_page']) : 10;
        $offset = ($page - 1) * $per_page;
        
        // Get filter parameters
        $date_from = isset($_POST['date_from']) ? sanitize_text_field($_POST['date_from']) : '';
        $date_to = isset($_POST['date_to']) ? sanitize_text_field($_POST['date_to']) : '';
        $category = isset($_POST['category']) ? sanitize_text_field($_POST['category']) : '';

        // Get scan history records
        $scan_history = Sure_Consent_Storage::get_scan_history($per_page, $offset);
        
        // Get total count
        $total_records = Sure_Consent_Storage::get_scan_history_count();
        $total_pages = ceil($total_records / $per_page);
        
        // Process scan history records to add cookie counts per category
        $processed_history = array();
        foreach ($scan_history as $record) {
            // Get cookie data and count by category
            $cookie_data = $record['scan_data'] ? $record['scan_data'] : array();
            $category_counts = array();
            
            // Count cookies by category
            foreach ($cookie_data as $cookie) {
                $cookie_category = isset($cookie['category']) ? $cookie['category'] : 'Uncategorized';
                if (!isset($category_counts[$cookie_category])) {
                    $category_counts[$cookie_category] = 0;
                }
                $category_counts[$cookie_category]++;
            }
            
            // Add processed record
            $processed_history[] = array(
                'id' => $record['id'],
                'scan_date' => $record['scan_date'],
                'total_cookies' => $record['total_cookies'],
                'scan_type' => $record['scan_type'],
                'pages_scanned' => $record['pages_scanned'],
                'category_counts' => $category_counts,
                'scan_data' => $cookie_data
            );
        }
        
        wp_send_json_success(array(
            'history' => $processed_history,
            'total' => $total_records,
            'page' => $page,
            'per_page' => $per_page,
            'total_pages' => $total_pages
        ));
    }
    
    /**
     * Get scan history record by ID
     */
    public static function get_scan_history_record() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }

        // Get record ID
        $record_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if (empty($record_id)) {
            wp_send_json_error(array('message' => 'Invalid record ID'));
            return;
        }
        
        // Get scan history record
        $record = Sure_Consent_Storage::get_scan_history_by_id($record_id);
        
        if ($record) {
            wp_send_json_success(array('record' => $record));
        } else {
            wp_send_json_error(array('message' => 'Record not found'));
        }
    }
    
    /**
     * Delete scan history record
     */
    public static function delete_scan_history_record() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }

        // Get record ID
        $record_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if (empty($record_id)) {
            wp_send_json_error(array('message' => 'Invalid record ID'));
            return;
        }
        
        // Delete scan history record
        $result = Sure_Consent_Storage::delete_scan_history($record_id);
        
        if ($result) {
            wp_send_json_success(array('message' => 'Record deleted successfully'));
        } else {
            wp_send_json_error(array('message' => 'Failed to delete record'));
        }
    }
    
    /**
     * Export scan history record as CSV
     */
    public static function export_scan_history_csv() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Get record ID
        $record_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if (empty($record_id)) {
            wp_die('Invalid record ID');
        }
        
        // Get scan history record
        $record = Sure_Consent_Storage::get_scan_history_by_id($record_id);
        
        if (!$record) {
            wp_die('Record not found');
        }
        
        // Set headers for CSV download
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="scan-history-' . $record_id . '.csv"');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        // Create CSV output
        $output = fopen('php://output', 'w');
        
        // Add CSV headers
        fputcsv($output, array('Cookie Name', 'Cookie Value', 'Domain', 'Path', 'Expires', 'Category', 'Note'));
        
        // Add cookie data
        $cookie_data = $record['scan_data'] ? $record['scan_data'] : array();
        foreach ($cookie_data as $cookie) {
            fputcsv($output, array(
                isset($cookie['name']) ? $cookie['name'] : '',
                isset($cookie['value']) ? $cookie['value'] : '',
                isset($cookie['domain']) ? $cookie['domain'] : '',
                isset($cookie['path']) ? $cookie['path'] : '',
                isset($cookie['expires']) ? $cookie['expires'] : '',
                isset($cookie['category']) ? $cookie['category'] : '',
                isset($cookie['note']) ? $cookie['note'] : ''
            ));
        }
        
        fclose($output);
        exit;
    }
    
    /**
     * Export scan history record as JSON
     */
    public static function export_scan_history_json() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Get record ID
        $record_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if (empty($record_id)) {
            wp_die('Invalid record ID');
        }
        
        // Get scan history record
        $record = Sure_Consent_Storage::get_scan_history_by_id($record_id);
        
        if (!$record) {
            wp_die('Record not found');
        }
        
        // Set headers for JSON download
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="scan-history-' . $record_id . '.json"');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        // Output JSON data
        echo json_encode($record['scan_data'], JSON_PRETTY_PRINT);
        exit;
    }
    
    /**
     * Save a scheduled scan
     */
    public static function save_scheduled_scan() {
        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }
        
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        // Get data
        $data = array(
            'frequency' => isset($_POST['frequency']) ? sanitize_text_field($_POST['frequency']) : '',
            'start_date' => isset($_POST['start_date']) ? sanitize_text_field($_POST['start_date']) : '',
            'start_time' => isset($_POST['start_time']) ? sanitize_text_field($_POST['start_time']) : '',
            'end_date' => isset($_POST['end_date']) ? sanitize_text_field($_POST['end_date']) : null
        );
        
        // Add ID if present (for updates)
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            $data['id'] = intval($_POST['id']);
        }
        
        // Save scheduled scan
        $result = Sure_Consent_Storage::save_scheduled_scan($data);
        
        if ($result) {
            if (isset($data['id'])) {
                wp_send_json_success(array('message' => 'Scheduled scan updated successfully', 'id' => $result));
            } else {
                wp_send_json_success(array('message' => 'Scheduled scan created successfully', 'id' => $result));
            }
        } else {
            wp_send_json_error(array('message' => 'Failed to save scheduled scan'));
        }
    }
    
    /**
     * Get all scheduled scans
     */
    public static function get_scheduled_scans() {
        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }
        
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        // Get scheduled scans
        $scans = Sure_Consent_Storage::get_scheduled_scans();
        
        wp_send_json_success(array('scans' => $scans));
    }
    
    /**
     * Delete a scheduled scan
     */
    public static function delete_scheduled_scan() {
        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }
        
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        // Get ID
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if (!$id) {
            wp_send_json_error(array('message' => 'Invalid schedule ID'));
            return;
        }
        
        // Delete scheduled scan
        $result = Sure_Consent_Storage::delete_scheduled_scan($id);
        
        if ($result) {
            wp_send_json_success(array('message' => 'Scheduled scan deleted successfully'));
        } else {
            wp_send_json_error(array('message' => 'Failed to delete scheduled scan'));
        }
    }
    
    /**
     * Check for scan completion notifications
     */
    public static function check_scan_notification() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }
        
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        // Check for scan notification
        $notification = get_option('sure_consent_last_scan_notification', false);
        
        if ($notification && isset($notification['cookies_found'])) {
            // Check if notification is still valid (within 1 hour)
            $scan_time = strtotime($notification['scan_date']);
            $current_time = current_time('timestamp');
            
            if (($current_time - $scan_time) < 3600) { // 1 hour
                wp_send_json_success(array(
                    'has_notification' => true,
                    'cookies_found' => $notification['cookies_found'],
                    'scan_id' => $notification['scan_id']
                ));
                
                // Clear the notification after sending it
                delete_option('sure_consent_last_scan_notification');
                return;
            } else {
                // Clear expired notification
                delete_option('sure_consent_last_scan_notification');
            }
        }
        
        wp_send_json_success(array(
            'has_notification' => false
        ));
    }
    
    /**
     * Handle automatic scan completion
     */
    public static function handle_automatic_scan_completion($schedule, $total_cookies, $cookies, $scan_history_id) {
        // This function can be used to send notifications or perform other actions
        // when an automatic scan completes
        error_log('SureConsent - Handling automatic scan completion for schedule ID: ' . $schedule->id);
        
        // For now, we just log the completion
        // In the future, this could send email notifications, update dashboards, etc.
    }
}

// Add action to handle automatic scan completion
add_action('sure_consent_automatic_scan_completed', array('Sure_Consent_Ajax', 'handle_automatic_scan_completion'), 10, 4);

// Add new action for checking scan notifications
add_action('wp_ajax_sure_consent_check_scan_notification', array(__CLASS__, 'check_scan_notification'));

// Initialize AJAX handlers
Sure_Consent_Ajax::init();