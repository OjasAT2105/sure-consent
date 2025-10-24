<?php

/**
 * Database handling for SureConsent plugin
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/includes
 */

class Sure_Consent_DB {

    /**
     * Create database tables for cookie scanning
     */
    public static function create_tables() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        // Consent logs table
        $logs_table = $wpdb->prefix . 'sureconsent_logs';
        $sql = "CREATE TABLE $logs_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            ip_address varchar(45) NOT NULL,
            user_id bigint(20) DEFAULT NULL,
            preferences longtext NOT NULL,
            action varchar(50) NOT NULL,
            timestamp datetime DEFAULT CURRENT_TIMESTAMP,
            user_agent text DEFAULT NULL,
            version varchar(10) DEFAULT '1.0',
            PRIMARY KEY (id),
            KEY ip_address (ip_address),
            KEY user_id (user_id),
            KEY timestamp (timestamp)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}