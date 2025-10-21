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
        
        // Also save directly as options for immediate access
        foreach ($settings_data as $key => $value) {
            $option_name = 'sure_consent_' . $key;
            delete_option($option_name); // Delete first to ensure update works
            add_option($option_name, $value);
            $saved_value = get_option($option_name);
            error_log('SureConsent - Saved: ' . $option_name . ' = ' . print_r($value, true) . ' (verified: ' . print_r($saved_value, true) . ')');
        }

        wp_send_json_success(array(
            'message' => 'All settings saved successfully',
            'settings' => $updated
        ));
    }

    /**
     * Get admin settings
     */
    public static function get_settings() {
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
        
        $settings = array(
            'message_heading' => (string) get_option('sure_consent_message_heading', ''),
            'message_description' => (string) get_option('sure_consent_message_description', ''),
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
            'decline_btn_color' => (string) get_option('sure_consent_decline_btn_color', 'transparent')
        );
        
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
        // Allow public access - check nonce only if provided
        if (isset($_POST['nonce']) && !empty($_POST['nonce'])) {
            if (!wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
                wp_die('Security check failed');
            }
        }

        $notice_type = get_option('sure_consent_notice_type', 'banner');
        $notice_position = get_option('sure_consent_notice_position', 'bottom');
        $banner_enabled = get_option('sure_consent_banner_enabled', false) || get_option('sure_consent_enable_banner', false);
        
        error_log('SureConsent - Getting public settings: notice_type=' . $notice_type . ', notice_position=' . $notice_position . ', enabled=' . ($banner_enabled ? 'true' : 'false'));

        $settings = array(
            'message_heading' => (string) get_option('sure_consent_message_heading', ''),
            'message_description' => (string) get_option('sure_consent_message_description', 'This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.'),
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
            'decline_btn_text_color' => (string) get_option('sure_consent_decline_btn_text_color', '#ffffff'),
            'decline_btn_show_as' => (string) get_option('sure_consent_decline_btn_show_as', 'button'),
            'decline_btn_bg_opacity' => (string) get_option('sure_consent_decline_btn_bg_opacity', '100'),
            'decline_btn_border_style' => (string) get_option('sure_consent_decline_btn_border_style', 'solid'),
            'decline_btn_border_color' => (string) get_option('sure_consent_decline_btn_border_color', '#6b7280'),
            'decline_btn_border_width' => (string) get_option('sure_consent_decline_btn_border_width', '1'),
            'decline_btn_border_radius' => (string) get_option('sure_consent_decline_btn_border_radius', '4'),
            'button_order' => (string) get_option('sure_consent_button_order', 'decline,accept,accept_all')
        );
        
        wp_send_json_success($settings);
    }
}

// Initialize AJAX handlers
Sure_Consent_Ajax::init();