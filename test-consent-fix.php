<?php
/**
 * Test page for consent fix verification
 */

// Include WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin capabilities
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('You do not have permission to access this page.');
}

// Get the latest consent logs
global $wpdb;
$table_name = $wpdb->prefix . 'sure_consent_logs';
$latest_logs = $wpdb->get_results("SELECT * FROM $table_name ORDER BY timestamp DESC LIMIT 5");

?>
<!DOCTYPE html>
<html>
<head>
    <title>Consent Fix Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1000px;
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
        .accepted {
            color: green;
            font-weight: bold;
        }
        .declined {
            color: red;
            font-weight: bold;
        }
        .partially-accepted {
            color: orange;
            font-weight: bold;
        }
        .essential {
            color: blue;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Consent Fix Verification</h1>
        
        <h2>Latest Consent Logs</h2>
        
        <?php if ($latest_logs): ?>
            <?php foreach ($latest_logs as $log): ?>
                <div class="log-entry">
                    <h3>Log Entry #<?php echo esc_html($log->id); ?></h3>
                    <p><strong>IP Address:</strong> <?php echo esc_html($log->ip_address); ?></p>
                    <p><strong>Timestamp:</strong> <?php echo esc_html($log->timestamp); ?></p>
                    <p><strong>Action:</strong> 
                        <span class="<?php echo esc_attr($log->action); ?>">
                            <?php echo esc_html(ucfirst($log->action)); ?>
                        </span>
                    </p>
                    <p><strong>Country:</strong> <?php echo esc_html($log->country); ?></p>
                    
                    <h4>Preferences:</h4>
                    <div class="preferences">
                        <?php
                        $preferences = json_decode($log->preferences, true);
                        if (is_array($preferences)) {
                            // Sort preferences to show essential first
                            ksort($preferences);
                            foreach ($preferences as $category => $value) {
                                $class = ($value === true) ? 'accepted' : 'declined';
                                $status = ($value === true) ? 'ACCEPTED' : 'DECLINED';
                                echo "<p><strong>" . esc_html($category) . ":</strong> <span class='$class'>$status</span></p>";
                            }
                        } else {
                            echo "<p>No preferences found</p>";
                        }
                        ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>No consent logs found.</p>
        <?php endif; ?>
        
        <h2>Test Instructions</h2>
        <ol>
            <li>Visit your site and test the following scenarios:</li>
            <ul>
                <li>Click "Accept All" - All categories (essential, functional, analytics, marketing, uncategorized) should show as ACCEPTED</li>
                <li>Click "Decline" - Only "essential" should show as ACCEPTED, others as DECLINED</li>
                <li>Use Preferences modal to selectively accept categories - Only selected categories should show as ACCEPTED</li>
            </ul>
            <li>Refresh this page to see the latest consent logs</li>
            <li>Verify that the consent logs accurately reflect user choices</li>
        </ol>
        
        <button onclick="location.reload()">Refresh</button>
        
        <h2>Reset Test</h2>
        <p><a href="?reset=1">Reset consent data</a> (This will clear your consent cookie for testing)</p>
        
        <?php
        if (isset($_GET['reset'])) {
            // Clear the consent cookie
            setcookie('sureconsent_user_consent', '', time() - 3600, '/');
            echo "<p>Consent cookie cleared. Refresh the page to test.</p>";
        }
        ?>
    </div>
</body>
</html>