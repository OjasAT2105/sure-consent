<?php
/**
 * The plugin bootstrap file
 *
 * @link              https://profiles.wordpress.org/brainstormforce/
 * @since             1.0.0
 * @package           Sure_Consent
 *
 * @wordpress-plugin
 * Plugin Name:       SureConsent
 * Plugin URI:        https://profiles.wordpress.org/brainstormforce/
 * Description:       Cookie Consent Management plugin 
 * Version:           1.0.0
 * Author:            BrainStorm Force
 * Author URI:        https://profiles.wordpress.org/brainstormforce/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       sure-consent
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 */
define( 'SURE_CONSENT_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 */
function activate_sure_consent() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-sure-consent-activator.php';
	Sure_Consent_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_sure_consent() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-sure-consent-deactivator.php';
	Sure_Consent_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_sure_consent' );
register_deactivation_hook( __FILE__, 'deactivate_sure_consent' );

/**
 * Core plugin class.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-sure-consent.php';

/**
 * Begin plugin execution.
 */
function run_sure_consent() {
	$plugin = new Sure_Consent();
	$plugin->run();
}

/**
 * Add SureConsent admin menu and submenus.
 */
add_action( 'admin_menu', 'sureconsent_add_admin_menu' );

function sureconsent_add_admin_menu() {
    // Main menu only
    add_menu_page(
        __( 'SureConsent', 'sureconsent' ),
        __( 'SureConsent', 'sureconsent' ),
        'manage_options',
        'sureconsent',
        'sureconsent_dashboard_page',
        'dashicons-shield-alt',
        58
    );
}

/**
 * Dashboard page content.
 */
function sureconsent_dashboard_page() {
    ?>
    <div class="wrap">
        <div id="sureconsent-admin-root"></div>
    </div>
    <?php
}



/**
 * Enqueue admin scripts and styles.
 */
add_action( 'admin_enqueue_scripts', 'sureconsent_enqueue_admin_assets' );

function sureconsent_enqueue_admin_assets( $hook ) {
    // Load scripts only on SureConsent page
    $allowed_hooks = array(
        'toplevel_page_sureconsent',
    );

    if ( ! in_array( $hook, $allowed_hooks, true ) ) {
        return;
    }

    $plugin_url = plugin_dir_url( __FILE__ );

    wp_enqueue_script(
        'sureconsent-admin',
        $plugin_url . 'dist/admin.js',
        array( 'wp-element' ),
        SURE_CONSENT_VERSION,
        true
    );

    wp_enqueue_style(
        'sureconsent-admin',
        $plugin_url . 'dist/admin.css',
        array(),
        SURE_CONSENT_VERSION
    );

    // Localize script for AJAX
    wp_localize_script(
        'sureconsent-admin',
        'sureConsentAjax',
        array(
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'sure_consent_nonce' ),
        )
    );
}

/**
 * Enqueue public scripts and styles.
 */
add_action( 'wp_enqueue_scripts', 'sureconsent_enqueue_public_assets' );

function sureconsent_enqueue_public_assets() {
    $plugin_url = plugin_dir_url( __FILE__ );

    wp_enqueue_script(
        'sureconsent-public',
        $plugin_url . 'dist/public.js',
        array(),
        SURE_CONSENT_VERSION,
        true
    );

    wp_enqueue_style(
        'sureconsent-public',
        $plugin_url . 'dist/public.css',
        array(),
        SURE_CONSENT_VERSION
    );
}

/**
 * AJAX handler for banner toggle.
 */
add_action( 'wp_ajax_sure_consent_toggle_banner', 'sure_consent_handle_banner_toggle' );

function sure_consent_handle_banner_toggle() {
    // Verify nonce
    if ( ! wp_verify_nonce( $_POST['nonce'], 'sure_consent_nonce' ) ) {
        wp_die( 'Security check failed' );
    }

    // Check user permissions
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Insufficient permissions' );
    }

    $enabled = sanitize_text_field( $_POST['enabled'] );
    update_option( 'sure_consent_banner_enabled', $enabled === '1' );

    wp_send_json_success( array( 'enabled' => $enabled === '1' ) );
}

/**
 * AJAX handler to get banner status.
 */
add_action( 'wp_ajax_sure_consent_get_banner_status', 'sure_consent_get_banner_status' );

function sure_consent_get_banner_status() {
    // Verify nonce
    if ( ! wp_verify_nonce( $_POST['nonce'], 'sure_consent_nonce' ) ) {
        wp_die( 'Security check failed' );
    }

    // Check user permissions
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Insufficient permissions' );
    }

    $enabled = get_option( 'sure_consent_banner_enabled', false );
    $preview = get_option( 'sure_consent_preview_enabled', false );
    wp_send_json_success( array( 'enabled' => (bool) $enabled, 'preview' => (bool) $preview ) );
}

/**
 * AJAX handler for preview toggle.
 */
add_action( 'wp_ajax_sure_consent_toggle_preview', 'sure_consent_handle_preview_toggle' );

function sure_consent_handle_preview_toggle() {
    // Verify nonce
    if ( ! wp_verify_nonce( $_POST['nonce'], 'sure_consent_nonce' ) ) {
        wp_die( 'Security check failed' );
    }

    // Check user permissions
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Insufficient permissions' );
    }

    $enabled = sanitize_text_field( $_POST['enabled'] );
    update_option( 'sure_consent_preview_enabled', $enabled === '1' );

    wp_send_json_success( array( 'preview' => $enabled === '1' ) );
}

/**
 * Add React root div to footer for public cookie banner.
 */
add_action( 'wp_footer', 'sureconsent_add_public_root' );

function sureconsent_add_public_root() {
    // Only show banner if enabled
    if ( get_option( 'sure_consent_banner_enabled', false ) ) {
        echo '<div id="sureconsent-public-root"></div>';
    }
}

run_sure_consent();
