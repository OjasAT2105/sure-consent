<?php

/**
 * Storage handler for SureConsent plugin
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/admin
 */

// Added Uncategorized category support - 2025-10-26

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
        
        // Add new action for fetching consent logs
        add_action('wp_ajax_sure_consent_get_consent_logs', array(__CLASS__, 'get_consent_logs'));
        
        // Add new action for fetching unique countries
        add_action('wp_ajax_sure_consent_get_unique_countries', array(__CLASS__, 'get_unique_countries'));
        
        // Add new action for generating PDF
        add_action('wp_ajax_sure_consent_generate_consent_pdf', array(__CLASS__, 'generate_consent_pdf'));
        
        // Create table on init if it doesn't exist
        add_action('init', array(__CLASS__, 'create_table'));
        
        // Check and add default categories if missing
        add_action('init', array(__CLASS__, 'check_default_categories'));
    }
    
    /**
     * Check if default categories exist and add them if missing
     */
    public static function check_default_categories() {
        // Only run for admin users
        if (!is_admin() || !current_user_can('manage_options')) {
            return;
        }
        
        // Get current cookie categories
        $cookie_categories_raw = get_option('sure_consent_cookie_categories', '[]');
        $cookie_categories = json_decode($cookie_categories_raw, true);
        
        // If no categories exist, don't add the default categories as it will be handled by frontend
        if (empty($cookie_categories) || !is_array($cookie_categories)) {
            return;
        }
        
        // Check if default categories exist and fix their properties if needed
        $default_categories = array('essential', 'functional', 'analytics', 'marketing', 'uncategorized');
        $updated_categories = array();
        $needs_update = false;
        
        foreach ($cookie_categories as $category) {
            if (isset($category['id']) && in_array($category['id'], $default_categories)) {
                // Ensure all default categories have required=true
                if (!isset($category['required']) || $category['required'] !== true) {
                    $category['required'] = true;
                    $needs_update = true;
                }
                
                // Set specific properties for each category
                switch ($category['id']) {
                    case 'essential':
                        if (!isset($category['name']) || empty($category['name'])) {
                            $category['name'] = 'Essential Cookies';
                            $needs_update = true;
                        }
                        if (!isset($category['description']) || empty($category['description'])) {
                            $category['description'] = 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in or filling in forms.';
                            $needs_update = true;
                        }
                        if (!isset($category['icon']) || empty($category['icon'])) {
                            $category['icon'] = 'Shield';
                            $needs_update = true;
                        }
                        break;
                        
                    case 'functional':
                        if (!isset($category['name']) || empty($category['name'])) {
                            $category['name'] = 'Functional Cookies';
                            $needs_update = true;
                        }
                        if (!isset($category['description']) || empty($category['description'])) {
                            $category['description'] = 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.';
                            $needs_update = true;
                        }
                        if (!isset($category['icon']) || empty($category['icon'])) {
                            $category['icon'] = 'Settings';
                            $needs_update = true;
                        }
                        break;
                        
                    case 'analytics':
                        if (!isset($category['name']) || empty($category['name'])) {
                            $category['name'] = 'Analytics Cookies';
                            $needs_update = true;
                        }
                        if (!isset($category['description']) || empty($category['description'])) {
                            $category['description'] = 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.';
                            $needs_update = true;
                        }
                        if (!isset($category['icon']) || empty($category['icon'])) {
                            $category['icon'] = 'BarChart3';
                            $needs_update = true;
                        }
                        break;
                        
                    case 'marketing':
                        if (!isset($category['name']) || empty($category['name'])) {
                            $category['name'] = 'Marketing Cookies';
                            $needs_update = true;
                        }
                        if (!isset($category['description']) || empty($category['description'])) {
                            $category['description'] = 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.';
                            $needs_update = true;
                        }
                        if (!isset($category['icon']) || empty($category['icon'])) {
                            $category['icon'] = 'Target';
                            $needs_update = true;
                        }
                        break;
                        
                    case 'uncategorized':
                        if (!isset($category['name']) || empty($category['name'])) {
                            $category['name'] = 'Uncategorized Cookies';
                            $needs_update = true;
                        }
                        if (!isset($category['description']) || empty($category['description'])) {
                            $category['description'] = 'These are cookies that do not fit into any of the other categories. They may be used for various purposes that are not specifically defined.';
                            $needs_update = true;
                        }
                        if (!isset($category['icon']) || empty($category['icon'])) {
                            $category['icon'] = 'FolderOpen';
                            $needs_update = true;
                        }
                        break;
                }
            }
            $updated_categories[] = $category;
        }
        
        // Add missing default categories
        $existing_ids = array_column($updated_categories, 'id');
        foreach ($default_categories as $default_id) {
            if (!in_array($default_id, $existing_ids)) {
                $default_category = null;
                switch ($default_id) {
                    case 'essential':
                        $default_category = array(
                            'id' => 'essential',
                            'name' => 'Essential Cookies',
                            'description' => 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in or filling in forms.',
                            'icon' => 'Shield',
                            'required' => true
                        );
                        break;
                        
                    case 'functional':
                        $default_category = array(
                            'id' => 'functional',
                            'name' => 'Functional Cookies',
                            'description' => 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
                            'icon' => 'Settings',
                            'required' => true
                        );
                        break;
                        
                    case 'analytics':
                        $default_category = array(
                            'id' => 'analytics',
                            'name' => 'Analytics Cookies',
                            'description' => 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.',
                            'icon' => 'BarChart3',
                            'required' => true
                        );
                        break;
                        
                    case 'marketing':
                        $default_category = array(
                            'id' => 'marketing',
                            'name' => 'Marketing Cookies',
                            'description' => 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
                            'icon' => 'Target',
                            'required' => true
                        );
                        break;
                        
                    case 'uncategorized':
                        $default_category = array(
                            'id' => 'uncategorized',
                            'name' => 'Uncategorized Cookies',
                            'description' => 'These are cookies that do not fit into any of the other categories. They may be used for various purposes that are not specifically defined.',
                            'icon' => 'FolderOpen',
                            'required' => true
                        );
                        break;
                }
                
                if ($default_category) {
                    $updated_categories[] = $default_category;
                    $needs_update = true;
                }
            }
        }
        
        // Update the categories if needed
        if ($needs_update) {
            update_option('sure_consent_cookie_categories', json_encode($updated_categories));
        }
    }

    /**
     * Create the consent logs table if it doesn't exist
     */
    public static function create_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            ip_address varchar(45) NOT NULL,
            user_id bigint(20) DEFAULT NULL,
            preferences longtext NOT NULL,
            action varchar(50) NOT NULL,
            timestamp datetime DEFAULT CURRENT_TIMESTAMP,
            user_agent text,
            country varchar(100) DEFAULT 'Unknown',
            version varchar(10) DEFAULT '1.0',
            PRIMARY KEY (id),
            KEY ip_address (ip_address),
            KEY user_id (user_id),
            KEY timestamp (timestamp),
            KEY country (country)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Update existing records to add country information
        self::update_existing_records();
    }
    
    /**
     * Update existing records to add country information
     */
    public static function update_existing_records() {
        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;
        
        // Check if country column exists
        $column_exists = $wpdb->get_var("SHOW COLUMNS FROM $table_name LIKE 'country'");
        
        if (!$column_exists) {
            // Add country column if it doesn't exist
            $wpdb->query("ALTER TABLE $table_name ADD COLUMN country varchar(100) DEFAULT 'Unknown'");
        }
        
        // Update existing records with country information
        // First, get all records that don't have country information
        $logs = $wpdb->get_results("SELECT id, ip_address FROM $table_name WHERE country IS NULL OR country = '' OR country = 'Unknown'");
        
        error_log("SureConsent - Updating " . count($logs) . " records with country information");
        
        foreach ($logs as $log) {
            $country = self::get_country_from_ip($log->ip_address);
            $result = $wpdb->update(
                $table_name,
                array('country' => $country),
                array('id' => $log->id),
                array('%s'),
                array('%d')
            );
            
            if ($result === false) {
                error_log("SureConsent - Failed to update country for log ID: " . $log->id);
            }
        }
        
        error_log("SureConsent - Finished updating records with country information");
    }

    /**
     * Save user consent to database
     */
    public static function save_consent() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Check if consent logging is enabled
        $consent_logging_enabled = get_option('sure_consent_consent_logging_enabled', true);
        
        // If logging is disabled, return success without saving to database
        if (!$consent_logging_enabled) {
            wp_send_json_success(array(
                'message' => 'Consent processed successfully (logging disabled)',
                'id' => null,
                'ip' => $_SERVER['REMOTE_ADDR'],
                'action' => isset($_POST['action_type']) ? sanitize_text_field($_POST['action_type']) : 'unknown'
            ));
            return;
        }

        // Get user IP
        $ip_address = $_SERVER['REMOTE_ADDR'];
        
        // Get current user ID (if logged in)
        $user_id = get_current_user_id();
        
        // Get preferences and action type
        $preferences = isset($_POST['preferences']) ? stripslashes($_POST['preferences']) : '';
        $action_type = isset($_POST['action_type']) ? sanitize_text_field($_POST['action_type']) : 'unknown';
        
        // Normalize action types - accept_all and accepted should both be treated as accepted
        if ($action_type === 'accept_all' || $action_type === 'accepted') {
            $action_type = 'accepted';
        }
        
        // Get user agent
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field($_SERVER['HTTP_USER_AGENT']) : '';
        
        // Get country from IP
        $country = self::get_country_from_ip($ip_address);
        
        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // Insert consent log
        $result = $wpdb->insert(
            $table_name,
            array(
                'ip_address' => $ip_address,
                'user_id' => $user_id > 0 ? $user_id : null,
                'preferences' => $preferences,
                'action' => $action_type,
                'user_agent' => $user_agent,
                'country' => $country,
                'version' => '1.0'
            ),
            array(
                '%s',
                $user_id > 0 ? '%d' : null,
                '%s',
                '%s',
                '%s',
                '%s',
                '%s'
            )
        );

        if ($result !== false) {
            wp_send_json_success(array(
                'message' => 'Consent saved successfully',
                'id' => $wpdb->insert_id,
                'ip' => $ip_address,
                'action' => $action_type
            ));
        } else {
            wp_send_json_error(array('message' => 'Failed to save consent'));
        }
    }

    /**
     * Get user consent from database
     */
    public static function get_user_consent() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Get user IP
        $ip_address = $_SERVER['REMOTE_ADDR'];
        
        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // Get the latest consent for this IP
        $consent = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE ip_address = %s ORDER BY timestamp DESC LIMIT 1",
            $ip_address
        ));

        if ($consent) {
            wp_send_json_success(array(
                'consent' => array(
                    'id' => $consent->id,
                    'ip_address' => $consent->ip_address,
                    'preferences' => json_decode($consent->preferences, true),
                    'action' => $consent->action,
                    'timestamp' => $consent->timestamp,
                    'version' => $consent->version
                )
            ));
        } else {
            wp_send_json_success(array('consent' => null));
        }
    }

    /**
     * Get all unique countries from consent logs
     */
    public static function get_unique_countries() {
        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // Get all unique countries from the database
        $countries = $wpdb->get_col("SELECT DISTINCT country FROM $table_name WHERE country IS NOT NULL AND country != ''");

        wp_send_json_success(array(
            'countries' => $countries
        ));
    }

    /**
     * Get consent logs with pagination (removed filter functionality)
     */
    public static function get_consent_logs() {
        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        // Make sure existing records are updated with country information
        self::update_existing_records();

        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // Get pagination parameters (removed filter parameters)
        $page = isset($_POST['page']) ? intval($_POST['page']) : 1;
        $per_page = isset($_POST['per_page']) ? intval($_POST['per_page']) : 10;
        
        error_log("SureConsent - get_consent_logs called with pagination: page=$page, per_page=$per_page");
        
        // Debug: Log all POST data
        error_log("SureConsent - POST data: " . print_r($_POST, true));
        
        $offset = ($page - 1) * $per_page;

        // Build query without filters
        $where_clause = "";
        $where_conditions = array();
        $where_values = array();

        // Build WHERE clause (empty since we removed filters)
        if (!empty($where_conditions)) {
            $where_clause = "WHERE " . implode(" AND ", $where_conditions);
        }
        
        error_log("SureConsent - WHERE clause: $where_clause");

        // Get total count
        $count_query = "SELECT COUNT(*) FROM $table_name $where_clause";
        if (!empty($where_values)) {
            $count_query = $wpdb->prepare($count_query, $where_values);
        }
        error_log("SureConsent - Count query: $count_query");
        
        // Get logs with pagination
        $query = "SELECT * FROM $table_name $where_clause ORDER BY timestamp DESC LIMIT %d OFFSET %d";
        
        if (!empty($where_values)) {
            // Add pagination parameters to query values
            $query_values = $where_values;
            $query_values[] = $per_page;
            $query_values[] = $offset;
            
            $final_query = $wpdb->prepare($query, $query_values);
            error_log("SureConsent - Final query: $final_query");
            $paginated_logs = $wpdb->get_results($final_query);
        } else {
            // No filters, just add pagination
            $final_query = $wpdb->prepare($query, $per_page, $offset);
            error_log("SureConsent - Final query (no filters): $final_query");
            $paginated_logs = $wpdb->get_results($final_query);
        }
        
        // Get total count for pagination
        $total_logs = $wpdb->get_var($count_query);
        $total_pages = ceil($total_logs / $per_page);
        
        error_log("SureConsent - Found " . count($paginated_logs) . " logs");
        error_log("SureConsent - Total logs: $total_logs, Total pages: $total_pages");

        // Process logs (country is already stored in database)
        $processed_logs = array();
        foreach ($paginated_logs as $log) {
            // Normalize the action type for display
            $normalized_action = $log->action;
            if ($log->action === 'accept_all') {
                $normalized_action = 'accepted';
            }
            
            $processed_log = array(
                'id' => $log->id,
                'ip_address' => $log->ip_address,
                'timestamp' => $log->timestamp,
                'country' => $log->country,
                'status' => $normalized_action,
                'preferences' => json_decode($log->preferences, true),
                'user_agent' => $log->user_agent
            );
            $processed_logs[] = $processed_log;
        }

        error_log("SureConsent - Sending response with " . count($processed_logs) . " logs");
        
        wp_send_json_success(array(
            'logs' => $processed_logs,
            'total' => $total_logs,
            'page' => $page,
            'per_page' => $per_page,
            'total_pages' => $total_pages
        ));
    }

    /**
     * Generate PDF for a consent log
     */
    public static function generate_consent_pdf() {
        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'sure_consent_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }

        // Get log ID
        $log_id = isset($_POST['log_id']) ? intval($_POST['log_id']) : 0;
        
        if (!$log_id) {
            wp_send_json_error(array('message' => 'Invalid log ID'));
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // Get the log
        $log = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $log_id
        ));

        if (!$log) {
            wp_send_json_error(array('message' => 'Log not found'));
            return;
        }

        // Return the log data so the frontend can generate the PDF
        wp_send_json_success(array(
            'log' => array(
                'id' => $log->id,
                'ip_address' => $log->ip_address,
                'timestamp' => $log->timestamp,
                'country' => $log->country,
                'status' => $log->action,
                'preferences' => json_decode($log->preferences, true),
                'user_agent' => $log->user_agent,
                'version' => $log->version
            )
        ));
    }

    /**
     * Create and output a PDF for a consent log
     */
    private static function create_consent_pdf($log) {
        // For now, we'll return a simple response indicating the PDF would be generated
        // In a real implementation, you would generate the PDF here
        // But we're now handling PDF generation in the frontend with jsPDF
        wp_send_json_success(array(
            'message' => 'PDF would be generated for log ID: ' . $log->id,
            'download_url' => admin_url('admin-ajax.php?action=sure_consent_download_pdf&log_id=' . $log->id)
        ));
    }

    /**
     * Get country from IP address
     * In a real implementation, this would call a geo-location service
     * For now, we'll use a simple mapping for testing and return "Local" for local IPs
     */
    private static function get_country_from_ip($ip) {
        // Handle localhost and private IPs
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return 'Localhost';
        }
        
        // Check for private IP ranges
        if (strpos($ip, '192.168.') === 0 || 
            strpos($ip, '10.') === 0 || 
            (strpos($ip, '172.') === 0 && 
             preg_match('/^172\.(1[6-9]|2[0-9]|3[01])\./', $ip))) {
            return 'Local Network';
        }

        // For production environments, you would integrate with a geo-location service
        // This is a simple mock implementation for testing
        $ip_prefixes = array(
            '192.169.' => 'United States',
            '192.170.' => 'United Kingdom',
            '192.171.' => 'Germany',
            '192.172.' => 'France',
            '192.173.' => 'Canada',
            '192.174.' => 'Australia',
            '192.175.' => 'Japan'
        );
        
        foreach ($ip_prefixes as $prefix => $country) {
            if (strpos($ip, $prefix) === 0) {
                return $country;
            }
        }
        
        // Return a default for unknown IPs
        return 'Unknown';
    }

    /**
     * Get consent logs by IP address
     */
    public static function get_logs_by_ip($ip_address, $limit = 10) {
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

    /**
     * Delete a single consent log by ID
     */
    public static function delete_consent_log($log_id) {
        // Check permissions
        if (!current_user_can('manage_options')) {
            return false;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // Delete the log
        $result = $wpdb->delete(
            $table_name,
            array('id' => $log_id),
            array('%d')
        );

        return $result !== false;
    }

    /**
     * Delete all consent logs
     */
    public static function delete_all_consent_logs() {
        // Check permissions
        if (!current_user_can('manage_options')) {
            return false;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . self::TABLE_NAME;

        // Delete all logs
        $result = $wpdb->query("DELETE FROM $table_name");

        return $result !== false;
    }
}

// Initialize storage
Sure_Consent_Storage::init();