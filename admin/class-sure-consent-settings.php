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
        'message_description' => 'This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.',
        'banner_text' => 'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
        'accept_button_text' => 'Accept All',
        'decline_button_text' => 'Decline',
        'banner_position' => 'bottom',
        'banner_color' => '#1f2937',
        'text_color' => '#ffffff',
        'accept_button_color' => '#2563eb',
        'decline_button_color' => 'transparent',
        'notice_type' => 'banner',
        'notice_position' => 'bottom',
        'enable_banner' => false,
        'show_preview' => false
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
            $settings[$key] = get_option('sure_consent_' . $key, $default);
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
            
            default:
                return sanitize_text_field($value);
        }
    }
}

// Initialize the settings handler
Sure_Consent_Settings::init();