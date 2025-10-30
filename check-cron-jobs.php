<?php
/**
 * Check current WordPress cron jobs
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/admin
 */

// Direct access forbidden
if (!defined('WPINC')) {
    die;
}

// Load WordPress
require_once('../../../wp-load.php');

// Get all cron jobs
echo "<h1>Current WordPress Cron Jobs</h1>\n";

$cron_jobs = _get_cron_array();

if ($cron_jobs) {
    echo "<table border='1' cellpadding='5' cellspacing='0'>\n";
    echo "<tr><th>Time</th><th>Hook</th><th>Arguments</th></tr>\n";
    
    foreach ($cron_jobs as $timestamp => $cron) {
        foreach ($cron as $hook => $dings) {
            echo "<tr>\n";
            echo "<td>" . date('Y-m-d H:i:s', $timestamp) . "</td>\n";
            echo "<td>" . $hook . "</td>\n";
            echo "<td>" . print_r($dings, true) . "</td>\n";
            echo "</tr>\n";
        }
    }
    
    echo "</table>\n";
} else {
    echo "<p>No cron jobs found</p>\n";
}

echo "<p><a href='/wp-admin/admin.php?page=sureconsent&tab=cookie-manager&subtab=schedule'>Back to Schedule Scan</a></p>\n";