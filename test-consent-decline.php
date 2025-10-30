<?php
/**
 * Test page for consent decline functionality
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin capabilities
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('You do not have permission to access this page.');
}

// Get the latest consent log
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';
$latest_log = $wpdb->get_row("SELECT * FROM $table_name ORDER BY timestamp DESC LIMIT 1");

?>
<!DOCTYPE html>
<html>
<head>
    <title>Consent Decline Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .log-entry {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
        }
        .preferences {
            background-color: #e9ecef;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .essential {
            color: green;
            font-weight: bold;
        }
        .non-essential {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Consent Decline Test</h1>
        
        <?php if ($latest_log): ?>
            <div class="log-entry">
                <h2>Latest Consent Log</h2>
                <p><strong>IP Address:</strong> <?php echo esc_html($latest_log->ip_address); ?></p>
                <p><strong>Timestamp:</strong> <?php echo esc_html($latest_log->timestamp); ?></p>
                <p><strong>Action:</strong> <?php echo esc_html($latest_log->action); ?></p>
                <p><strong>Country:</strong> <?php echo esc_html($latest_log->country); ?></p>
                
                <h3>Preferences:</h3>
                <div class="preferences">
                    <?php
                    $preferences = json_decode($latest_log->preferences, true);
                    if (is_array($preferences)) {
                        foreach ($preferences as $category => $value) {
                            $class = ($value === true) ? 'essential' : 'non-essential';
                            $status = ($value === true) ? 'ACCEPTED' : 'DECLINED';
                            echo "<p><strong>" . esc_html($category) . ":</strong> <span class='$class'>$status</span></p>";
                        }
                    } else {
                        echo "<p>No preferences found</p>";
                    }
                    ?>
                </div>
            </div>
        <?php else: ?>
            <p>No consent logs found.</p>
        <?php endif; ?>
        
        <h2>Test Instructions</h2>
        <ol>
            <li>Visit your site and click "Decline" on the cookie banner</li>
            <li>Refresh this page to see the latest consent log</li>
            <li>Verify that only essential cookies are marked as accepted</li>
        </ol>
        
        <button onclick="location.reload()">Refresh</button>
    </div>
</body>
</html>