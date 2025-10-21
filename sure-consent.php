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
 * Settings handler.
 */
require plugin_dir_path( __FILE__ ) . 'admin/class-sure-consent-settings.php';

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
    $icon_svg = 'data:image/svg+xml;base64,' . base64_encode('<svg fill="none" height="20" viewBox="0 0 25 24" width="20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M12.5 24C19.1275 24 24.5 18.6273 24.5 11.9999C24.5 5.37255 19.1275 0 12.5 0C5.87259 0 0.5 5.37255 0.5 11.9999C0.5 18.6273 5.87259 24 12.5 24ZM12.5517 5.99996C11.5882 5.99996 10.2547 6.55101 9.5734 7.23073L7.7229 9.07688H16.9465L20.0307 5.99996H12.5517ZM15.4111 16.7692C14.7298 17.4489 13.3964 17.9999 12.4328 17.9999H4.95388L8.03804 14.923H17.2616L15.4111 16.7692ZM18.4089 10.6153H6.18418L5.60673 11.1923C4.23941 12.423 4.64495 13.3846 6.5598 13.3846H18.8176L19.3952 12.8076C20.7492 11.5841 20.3237 10.6153 18.4089 10.6153Z" fill="#a7aaad" fill-rule="evenodd"/></svg>');
    
    add_menu_page(
        __( 'SureConsent', 'sureconsent' ),
        __( 'SureConsent', 'sureconsent' ),
        'manage_options',
        'sureconsent',
        'sureconsent_dashboard_page',
        $icon_svg,
        58
    );
}

/**
 * Dashboard page content.
 */
function sureconsent_dashboard_page() {
    ?>
    <div id="sureconsent-admin-root"></div>
    <?php
}



/**
 * Enqueue admin scripts and styles.
 */
add_action( 'admin_enqueue_scripts', 'sureconsent_enqueue_admin_assets' );

function sureconsent_enqueue_admin_assets( $hook ) {
    // Load scripts only on SureConsent pages
    $allowed_hooks = array(
        'toplevel_page_sureconsent',
        'sureconsent_page_sureconsent-banner',
        'sureconsent_page_sureconsent-settings',
        'sureconsent_page_sureconsent-analytics',
        'sureconsent_page_sureconsent-advanced',
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

    // Localize script for AJAX
    wp_localize_script(
        'sureconsent-public',
        'sureConsentAjax',
        array(
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'sure_consent_nonce' ),
        )
    );
}

/**
 * Include AJAX handlers
 */
require_once plugin_dir_path( __FILE__ ) . 'admin/class-sure-consent-ajax.php';

/**
 * Add React root div to footer for public cookie banner.
 */
add_action( 'wp_footer', 'sureconsent_add_public_root' );

function sureconsent_add_public_root() {
    // Always add the root div - the React app will handle visibility
    echo '<div id="sureconsent-public-root"></div>';
}

run_sure_consent();
