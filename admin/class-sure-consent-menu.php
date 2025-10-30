<?php

/**
 * Menu handler for SureConsent plugin
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/admin
 */

class Sure_Consent_Menu {

    /**
     * Initialize the menu handler
     */
    public static function init() {
        add_action('admin_menu', array(__CLASS__, 'register_admin_menu'));
        add_action('admin_init', array(__CLASS__, 'redirect_to_scheduled_scan'));
    }

    /**
     * Register the admin menu
     */
    public static function register_admin_menu() {
        // Add main menu page
        add_menu_page(
            'SureConsent',
            'SureConsent',
            'manage_options',
            'sureconsent',
            array(__CLASS__, 'render_admin_page'),
            'dashicons-shield',
            30
        );
    }

    /**
     * Render the admin page
     */
    public static function render_admin_page() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }

        // Enqueue admin styles and scripts
        wp_enqueue_style('sure-consent-admin');
        wp_enqueue_script('sure-consent-admin');
        
        // Localize script with AJAX URL and nonce
        wp_localize_script('sure-consent-admin', 'sureConsentAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('sure_consent_nonce')
        ));

        echo '<div class="wrap">';
        echo '<div id="sureconsent-admin-root"></div>';
        echo '</div>';
    }
    
    /**
     * Redirect to scheduled scan if needed
     */
    public static function redirect_to_scheduled_scan() {
        // Check if we're on the main SureConsent page
        if (isset($_GET['page']) && $_GET['page'] === 'sureconsent') {
            // Check for scheduled scan redirect
            require_once plugin_dir_path(dirname(__FILE__)) . 'class-sure-consent-storage.php';
            $schedule_id = Sure_Consent_Storage::check_scheduled_scan_redirect();
            
            if ($schedule_id) {
                // Add auto_scan parameter to trigger automatic scanning
                $redirect_url = add_query_arg('auto_scan', $schedule_id, $_SERVER['REQUEST_URI']);
                wp_redirect($redirect_url);
                exit;
            }
        }
    }
}

// Initialize the menu handler
Sure_Consent_Menu::init();