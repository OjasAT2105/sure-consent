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

    // Get custom CSS from settings and add it as an inline style
    $custom_css = get_option('sure_consent_custom_css', '');
    if (!empty($custom_css)) {
        wp_add_inline_style('sureconsent-public', "/* SureConsent Custom CSS - Public */\n" . $custom_css);
    }

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
 * Include cookie consent handler
 */
require_once plugin_dir_path( __FILE__ ) . 'admin/class-sure-consent-cookies.php';

/**
 * Include consent storage handler
 */
require_once plugin_dir_path( __FILE__ ) . 'admin/class-sure-consent-storage.php';

// Initialize the storage class to register AJAX handlers
if (class_exists('Sure_Consent_Storage')) {
    Sure_Consent_Storage::init();
    // Update existing records with country information
    add_action('init', array('Sure_Consent_Storage', 'update_existing_records'));
    
    // Schedule cron job for checking scheduled scans
    if (!wp_next_scheduled('sure_consent_check_scheduled_scans')) {
        error_log('SureConsent - Scheduling cron job for sure_consent_check_scheduled_scans');
        wp_schedule_event(time(), 'minutely', 'sure_consent_check_scheduled_scans');
    } else {
        error_log('SureConsent - Cron job already scheduled for sure_consent_check_scheduled_scans');
        error_log('SureConsent - Next scheduled run: ' . date('Y-m-d H:i:s', wp_next_scheduled('sure_consent_check_scheduled_scans')));
    }
}

// Initialize the AJAX class to register AJAX handlers
if (class_exists('Sure_Consent_Ajax')) {
    Sure_Consent_Ajax::init();
}

// Add cron job handler for checking scheduled scans
add_action('sure_consent_check_scheduled_scans', array('Sure_Consent_Storage', 'check_scheduled_scans'));

// Check for scheduled scan redirect on admin pages
add_action('admin_init', 'sure_consent_check_scheduled_scan_redirect');

function sure_consent_check_scheduled_scan_redirect() {
    // Removed scheduled scan redirect functionality
}

function sure_consent_handle_scheduled_scan($schedule_id) {
    // Removed scheduled scan handling functionality
}

// Add action to handle scheduled scan events
add_action('sure_consent_run_scheduled_scan', 'sure_consent_handle_scheduled_scan');

// Add admin notification for completed scans
add_action('admin_notices', 'sure_consent_scan_completed_notice');

function sure_consent_scan_completed_notice() {
    // Only show on SureConsent admin pages
    $screen = get_current_screen();
    if (strpos($screen->id, 'sureconsent') === false) {
        return;
    }
    
    $notification = get_option('sure_consent_last_scan_notification', false);
    
    if ($notification && isset($notification['cookies_found'])) {
        // Check if notification is still valid (within 1 hour)
        $scan_time = strtotime($notification['scan_date']);
        $current_time = current_time('timestamp');
        
        if (($current_time - $scan_time) < 3600) { // 1 hour
            $cookies_found = $notification['cookies_found'];
            $scan_id = $notification['scan_id'];
            
            echo '<div class="notice notice-success is-dismissible">';
            echo '<p><strong>SureConsent:</strong> Automatic cookie scan completed! Found ' . $cookies_found . ' cookies. ';
            echo '<a href="admin.php?page=sureconsent&tab=cookie-manager&subtab=scan">View Scanned Cookies</a> | ';
            echo '<a href="admin.php?page=sureconsent&tab=cookie-manager&subtab=history">View Scan History</a></p>';
            echo '</div>';
            
            // Clear the notification after displaying it
            delete_option('sure_consent_last_scan_notification');
        } else {
            // Clear expired notification
            delete_option('sure_consent_last_scan_notification');
        }
    }
}

// Add custom cron schedule

/**
 * Add React root div to footer for public cookie banner.
 */
add_action( 'wp_footer', 'sureconsent_add_public_root' );

function sureconsent_add_public_root() {
    // Always add the root div - the React app will handle visibility
    echo '<div id="sureconsent-public-root"></div>';
}

run_sure_consent();