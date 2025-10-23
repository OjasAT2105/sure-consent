<?php

/**
 * Cookie consent handler for SureConsent plugin
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/admin
 */

class Sure_Consent_Cookies {

    /**
     * Cookie name for storing user consent
     */
    const CONSENT_COOKIE_NAME = 'sureconsent_user_consent';

    /**
     * Cookie expiry in days
     */
    const CONSENT_COOKIE_EXPIRY = 365;

    /**
     * Initialize consent handler
     */
    public static function init() {
        add_action('wp_ajax_sure_consent_verify_consent', array(__CLASS__, 'verify_consent'));
        add_action('wp_ajax_nopriv_sure_consent_verify_consent', array(__CLASS__, 'verify_consent'));
    }

    /**
     * Get user consent from cookie
     */
    public static function get_user_consent() {
        if (!isset($_COOKIE[self::CONSENT_COOKIE_NAME])) {
            return null;
        }

        $consent_data = json_decode(urldecode($_COOKIE[self::CONSENT_COOKIE_NAME]), true);
        
        if (!is_array($consent_data)) {
            return null;
        }

        return $consent_data;
    }

    /**
     * Check if user has given consent
     */
    public static function has_consent() {
        return self::get_user_consent() !== null;
    }

    /**
     * Check if specific category is allowed
     */
    public static function is_allowed($category) {
        $consent = self::get_user_consent();
        
        if (!$consent) {
            // No consent given - only essential is allowed
            return $category === 'essential';
        }

        if (!isset($consent['preferences']) || !is_array($consent['preferences'])) {
            return false;
        }

        return isset($consent['preferences'][$category]) && $consent['preferences'][$category] === true;
    }

    /**
     * AJAX handler to verify consent status
     */
    public static function verify_consent() {
        $consent = self::get_user_consent();
        
        wp_send_json_success(array(
            'has_consent' => $consent !== null,
            'consent_data' => $consent
        ));
    }

    /**
     * Helper function to conditionally load scripts based on consent
     * Usage in PHP: Sure_Consent_Cookies::script_tag('analytics', 'https://analytics.example.com/script.js');
     */
    public static function script_tag($category, $src, $inline_script = '') {
        if (self::is_allowed($category)) {
            // User has given consent - output normal script
            if ($inline_script) {
                echo "<script type=\"text/javascript\">{$inline_script}</script>";
            } else {
                echo "<script type=\"text/javascript\" src=\"{$src}\"></script>";
            }
        } else {
            // User hasn't given consent - output blocked script
            if ($inline_script) {
                echo "<script type=\"text/plain\" data-consent=\"{$category}\">{$inline_script}</script>";
            } else {
                echo "<script type=\"text/plain\" data-consent=\"{$category}\" src=\"{$src}\"></script>";
            }
        }
    }

    /**
     * Get consent summary for admin display
     */
    public static function get_consent_stats() {
        global $wpdb;
        
        // This is a placeholder - in a full implementation,
        // you'd store consent logs in a database table
        return array(
            'total_consents' => 0,
            'accept_all' => 0,
            'decline_all' => 0,
            'custom' => 0
        );
    }
}

// Initialize consent handler
Sure_Consent_Cookies::init();
