<?php
/**
 * Consent Storage Handler
 * Stores user consent decisions with IP tracking
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/admin
 */

class Sure_Consent_Storage {

    /**
     * Table name for consent logs
     */
    const TABLE_NAME = 'sure_consent_logs';

    /**
     * Initialize storage system
     */
    public static function init() {
        add_action('wp_ajax_sure_consent_save_consent', array(__CLASS__, 'save_consent'));
        add_action('wp_ajax_nopriv_sure_consent_save_consent', array(__CLASS__, 'save_consent'));
        
        add_action('wp_ajax_sure_consent_get_user_consent', array(__CLASS__, 'get_user_consent'));
        add_action('wp_ajax_nopriv_sure_consent_get_user_consent', array(__CLASS__, 'get_user_consent'));
    }

    /**
     * Create consent logs table
     */
    public static function create_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            ip_address varchar(45) NOT NULL,
            user_id bigint(20) DEFAULT NULL,
            preferences longtext NOT NULL,
            action varchar(50) NOT NULL,
            timestamp datetime DEFAULT CURRENT_TIMESTAMP,
            user_agent text DEFAULT NULL,
            version varchar(10) DEFAULT '1.0',
            PRIMARY KEY  (id),
            KEY ip_address (ip_address),
            KEY user_id (user_id),
            KEY timestamp (timestamp)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

        error_log('SureConsent - Consent logs table created/verified');
    }

    /**
     * Get user's IP address
     */
    private static function get_ip_address() {
        $ip_keys = array(
            'HTTP_CLIENT_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_FORWARDED',
            'HTTP_X_CLUSTER_CLIENT_IP',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED',
            'REMOTE_ADDR'
        );

        foreach ($ip_keys as $key) {
            if (array_key_exists($key, $_SERVER)) {
                $ip_list = explode(',', $_SERVER[$key]);
                foreach ($ip_list as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP)) {
                        return $ip;
                    }
                }
            }
        }

        return '0.0.0.0';
    }

    /**
     * Save consent via AJAX
     */
    public static function save_consent() {
        global $wpdb;

        // Get data from request
        $preferences = isset($_POST['preferences']) ? json_decode(stripslashes($_POST['preferences']), true) : array();
        $action = isset($_POST['action_type']) ? sanitize_text_field($_POST['action_type']) : 'custom';

        if (empty($preferences)) {
            wp_send_json_error(array('message' => 'No preferences provided'));
            return;
        }

        // Get user info
        $ip_address = self::get_ip_address();
        $user_id = get_current_user_id();
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field($_SERVER['HTTP_USER_AGENT']) : '';

        // Insert into database
        $table_name = $wpdb->prefix . self::TABLE_NAME;
        $inserted = $wpdb->insert(
            $table_name,
            array(
                'ip_address' => $ip_address,
                'user_id' => $user_id > 0 ? $user_id : null,
                'preferences' => json_encode($preferences),
                'action' => $action,
                'timestamp' => current_time('mysql'),
                'user_agent' => $user_agent,
                'version' => '1.0'
            ),
            array('%s', '%d', '%s', '%s', '%s', '%s', '%s')
        );

        if ($inserted) {
            error_log("SureConsent - Consent saved for IP: $ip_address, Action: $action");
            wp_send_json_success(array(
                'message' => 'Consent saved successfully',
                'ip' => $ip_address,
                'action' => $action,
                'id' => $wpdb->insert_id
            ));
        } else {
            error_log('SureConsent - Failed to save consent: ' . $wpdb->last_error);
            wp_send_json_error(array('message' => 'Failed to save consent'));
        }
    }

    /**
     * Get user consent by IP
     */
    public static function get_user_consent() {
        global $wpdb;

        $ip_address = self::get_ip_address();
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // Get latest consent for this IP
        $consent = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE ip_address = %s ORDER BY timestamp DESC LIMIT 1",
            $ip_address
        ));

        if ($consent) {
            wp_send_json_success(array(
                'preferences' => json_decode($consent->preferences, true),
                'action' => $consent->action,
                'timestamp' => $consent->timestamp,
                'version' => $consent->version
            ));
        } else {
            wp_send_json_success(array('consent' => null));
        }
    }

    /**
     * Get all consents for an IP (history)
     */
    public static function get_consent_history($ip_address, $limit = 10) {
        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_name WHERE ip_address = %s ORDER BY timestamp DESC LIMIT %d",
            $ip_address,
            $limit
        ));

        return $results;
    }

    /**
     * Delete old consent logs (GDPR cleanup)
     */
    public static function cleanup_old_logs($days = 365) {
        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        $deleted = $wpdb->query($wpdb->prepare(
            "DELETE FROM $table_name WHERE timestamp < DATE_SUB(NOW(), INTERVAL %d DAY)",
            $days
        ));

        error_log("SureConsent - Cleaned up $deleted old consent logs");
        return $deleted;
    }
}

// Initialize storage
Sure_Consent_Storage::init();
