<?php

/**
 * Settings handler for SureConsent plugin
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/admin
 */

class Sure_Consent_Settings {

    /**
     * Available settings with their default values
     */
    private static $settings = array(
        'banner_enabled' => false,
        'preview_enabled' => false,
        'message_heading' => '',
        'message_description' => 'We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies. You can learn more about how we use cookies in our Privacy Policy.',
        'banner_text' => 'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
        'accept_button_text' => 'Accept All',
        'decline_button_text' => 'Decline',
        'banner_position' => 'bottom',
        'banner_color' => '#1f2937',
        'banner_bg_color' => '#1f2937',
        'bg_opacity' => '100',
        'text_color' => '#ffffff',
        'border_style' => 'solid',
        'border_width' => '1',
        'border_color' => '#000000',
        'border_radius' => '8',
        'font' => 'Arial',
        'banner_logo' => '',
        'accept_button_color' => '#2563eb',
        'accept_btn_color' => '#2563eb',
        'accept_btn_text' => 'Accept',
        'accept_btn_text_color' => '#ffffff',
        'accept_btn_show_as' => 'button',
        'accept_btn_bg_opacity' => '100',
        'accept_btn_border_style' => 'none',
        'accept_btn_border_color' => '#000000',
        'accept_btn_border_width' => '1',
        'accept_btn_border_radius' => '4',
        'accept_all_enabled' => false,
        'accept_all_btn_text' => 'Accept All',
        'accept_all_btn_text_color' => '#ffffff',
        'accept_all_btn_show_as' => 'button',
        'accept_all_btn_bg_color' => '#2563eb',
        'accept_all_btn_bg_opacity' => '100',
        'accept_all_btn_border_style' => 'none',
        'accept_all_btn_border_color' => '#000000',
        'accept_all_btn_border_width' => '1',
        'accept_all_btn_border_radius' => '4',
        'decline_btn_text' => 'Decline',
        'decline_btn_text_color' => '#ffffff',
        'decline_btn_show_as' => 'button',
        'decline_btn_bg_opacity' => '100',
        'decline_btn_border_style' => 'solid',
        'decline_btn_border_color' => '#6b7280',
        'decline_btn_border_width' => '1',
        'decline_btn_border_radius' => '4',
        'settings_btn_text' => 'Cookie Settings',
        'settings_btn_text_color' => '#ffffff',
        'settings_btn_bg_color' => '#6b7280',
        'settings_btn_bg_opacity' => '100',
        'settings_btn_border_style' => 'none',
        'settings_btn_border_color' => '#000000',
        'settings_btn_border_width' => '1',
        'settings_btn_border_radius' => '4',
        'decline_button_color' => 'transparent',
        'decline_btn_color' => 'transparent',
        'button_order' => 'decline,accept,accept_all',
        'compliance_law' => array('id' => '1', 'name' => 'GDPR'),
        'notice_type' => 'banner',
        'notice_position' => 'bottom',
        'enable_banner' => false,
        'show_preview' => false,
        'cookie_categories' => array(),
        'custom_cookies' => array()  // Add this line
    );

    /**
     * Initialize the settings handler
     */
    public static function init() {
        add_action('wp_ajax_sure_consent_save_settings', array(__CLASS__, 'save_settings'));
        add_action('wp_ajax_sure_consent_get_settings', array(__CLASS__, 'get_settings'));
    }

    /**
     * Get all settings
     */
    public static function get_all_settings() {
        $settings = array();
        foreach (self::$settings as $key => $default) {
            $option_value = get_option('sure_consent_' . $key, $default);
            
            // Special handling for cookie_categories and custom_cookies - decode JSON
            if ($key === 'cookie_categories' || $key === 'custom_cookies') {
                if (is_string($option_value)) {
                    $decoded = json_decode($option_value, true);
                    $settings[$key] = is_array($decoded) ? $decoded : array();
                } else if (is_array($option_value)) {
                    $settings[$key] = $option_value;
                } else {
                    $settings[$key] = array();
                }
            } else {
                $settings[$key] = $option_value;
            }
        }
        return $settings;
    }

    /**
     * Get single setting
     */
    public static function get_setting($key, $default = null) {
        if (!array_key_exists($key, self::$settings)) {
            return $default;
        }
        return get_option('sure_consent_' . $key, self::$settings[$key]);
    }

    /**
     * Update single setting
     */
    public static function update_setting($key, $value) {
        if (!array_key_exists($key, self::$settings)) {
            return false;
        }
        
        // Special handling for cookie_categories and custom_cookies - encode as JSON
        if (($key === 'cookie_categories' || $key === 'custom_cookies') && is_array($value)) {
            return update_option('sure_consent_' . $key, json_encode($value));
        }
        
        return update_option('sure_consent_' . $key, $value);
    }

    /**
     * AJAX handler to get all settings
     */
    public static function get_settings() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        // Check user permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        $settings = self::get_all_settings();
        wp_send_json_success($settings);
    }

    /**
     * AJAX handler to save multiple settings at once
     */
    public static function save_settings() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        // Check user permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        $settings_data = json_decode(stripslashes($_POST['settings']), true);
        
        if (!is_array($settings_data)) {
            wp_send_json_error('Invalid settings data');
        }

        $updated_settings = array();
        $errors = array();

        foreach ($settings_data as $key => $value) {
            if (array_key_exists($key, self::$settings)) {
                $sanitized_value = self::sanitize_setting($key, $value);
                if (self::update_setting($key, $sanitized_value)) {
                    $updated_settings[$key] = $sanitized_value;
                } else {
                    $errors[] = "Failed to update {$key}";
                }
            } else {
                $errors[] = "Invalid setting key: {$key}";
            }
        }

        if (!empty($errors)) {
            wp_send_json_error(array(
                'message' => 'Some settings failed to save',
                'errors' => $errors,
                'updated' => $updated_settings
            ));
        }

        wp_send_json_success(array(
            'message' => 'Settings saved successfully',
            'settings' => $updated_settings
        ));
    }

    /**
     * Sanitize setting value based on key
     */
    private static function sanitize_setting($key, $value) {
        switch ($key) {
            case 'banner_enabled':
            case 'preview_enabled':
            case 'enable_banner':
            case 'show_preview':
                return (bool) $value;
            
            case 'banner_text':
            case 'accept_button_text':
            case 'decline_button_text':
                return sanitize_textarea_field($value);
            
            case 'banner_position':
                return in_array($value, array('top', 'bottom')) ? $value : 'bottom';
            
            case 'notice_type':
                return in_array($value, array('banner', 'box', 'popup')) ? $value : 'banner';
            
            case 'notice_position':
                $valid_positions = array('top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right');
                return in_array($value, $valid_positions) ? $value : 'bottom';
            
            case 'banner_color':
            case 'text_color':
            case 'accept_button_color':
            case 'decline_button_color':
                return sanitize_hex_color($value) ?: $value;
            
            case 'compliance_law':
                return is_array($value) ? $value : array('id' => '1', 'name' => 'GDPR');
            
            case 'cookie_categories':
            case 'custom_cookies':  // Add this line
                return is_array($value) ? $value : array();
            
            default:
                return sanitize_text_field($value);
        }
    }
}

// Initialize the settings handler
Sure_Consent_Settings::init();