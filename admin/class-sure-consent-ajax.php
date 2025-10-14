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
        add_action('wp_ajax_sure_consent_get_public_settings', array(__CLASS__, 'get_public_settings'));
        add_action('wp_ajax_nopriv_sure_consent_get_public_settings', array(__CLASS__, 'get_public_settings'));
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

        $updated = array();
        
        // Handle preview_enabled specifically
        if (isset($settings_data['preview_enabled'])) {
            update_option('sure_consent_preview_enabled', (bool) $settings_data['preview_enabled']);
            $updated['preview_enabled'] = (bool) $settings_data['preview_enabled'];
        }

        // Handle other settings through the settings class
        if (class_exists('Sure_Consent_Settings')) {
            foreach ($settings_data as $key => $value) {
                if ($key !== 'preview_enabled') {
                    Sure_Consent_Settings::update_setting($key, $value);
                    $updated[$key] = $value;
                }
            }
        }

        wp_send_json_success(array(
            'message' => 'All settings saved successfully',
            'settings' => $updated
        ));
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
        update_option('sure_consent_banner_enabled', $enabled === '1');

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

        $enabled = get_option('sure_consent_banner_enabled', false);
        $preview = get_option('sure_consent_preview_enabled', false);
        wp_send_json_success(array('enabled' => (bool) $enabled, 'preview' => (bool) $preview));
    }

    /**
     * Get public settings (no auth required)
     */
    public static function get_public_settings() {
        if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_die('Security check failed');
        }

        $settings = array(
            'message_heading' => get_option('sure_consent_message_heading', ''),
            'message_description' => get_option('sure_consent_message_description', 'This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.')
        );
        
        wp_send_json_success($settings);
    }
}

// Initialize AJAX handlers
Sure_Consent_Ajax::init();