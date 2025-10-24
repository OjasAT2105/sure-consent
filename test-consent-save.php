<?php
/**
 * Test script to manually trigger consent saving
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    wp_die('Access denied');
}

// Handle form submission
if (isset($_POST['save_consent'])) {
    // Simulate the AJAX call to save consent
    $preferences = array(
        'Essential Cookies' => isset($_POST['essential']),
        'Functional Cookies' => isset($_POST['functional']),
        'Analytics Cookies' => isset($_POST['analytics']),
        'Marketing Cookies' => isset($_POST['marketing'])
    );
    
    $action_type = sanitize_text_field($_POST['action_type']);
    
    // Call the storage method directly
    if (class_exists('Sure_Consent_Storage')) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'sure_consent_logs';
        
        $inserted = $wpdb->insert(
            $table_name,
            array(
                'ip_address' => '127.0.0.1',
                'user_id' => get_current_user_id() > 0 ? get_current_user_id() : null,
                'preferences' => json_encode($preferences),
                'action' => $action_type,
                'timestamp' => current_time('mysql'),
                'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field($_SERVER['HTTP_USER_AGENT']) : '',
                'version' => '1.0'
            ),
            array('%s', '%d', '%s', '%s', '%s', '%s', '%s')
        );
        
        if ($inserted) {
            $message = "Consent log saved successfully! ID: " . $wpdb->insert_id;
            $message_type = "success";
        } else {
            $message = "Failed to save consent log: " . $wpdb->last_error;
            $message_type = "error";
        }
    } else {
        $message = "Sure_Consent_Storage class not found";
        $message_type = "error";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>SureConsent - Test Consent Save</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="checkbox"] { margin-right: 10px; }
        button { background: #0073aa; color: white; padding: 10px 15px; border: none; cursor: pointer; }
        button:hover { background: #005a87; }
        .message { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <h1>SureConsent - Test Consent Save</h1>
    
    <?php if (isset($message)): ?>
        <div class="message <?php echo $message_type; ?>">
            <?php echo esc_html($message); ?>
        </div>
    <?php endif; ?>
    
    <form method="post">
        <div class="form-group">
            <label>
                <input type="checkbox" name="essential" value="1" checked> 
                Essential Cookies
            </label>
        </div>
        
        <div class="form-group">
            <label>
                <input type="checkbox" name="functional" value="1"> 
                Functional Cookies
            </label>
        </div>
        
        <div class="form-group">
            <label>
                <input type="checkbox" name="analytics" value="1"> 
                Analytics Cookies
            </label>
        </div>
        
        <div class="form-group">
            <label>
                <input type="checkbox" name="marketing" value="1"> 
                Marketing Cookies
            </label>
        </div>
        
        <div class="form-group">
            <label>Action Type:</label>
            <select name="action_type">
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="partially_accepted" selected>Partially Accepted</option>
                <option value="accept_all">Accept All</option>
                <option value="decline_all">Decline All</option>
            </select>
        </div>
        
        <button type="submit" name="save_consent">Save Consent</button>
    </form>
    
    <p><a href="check-table.php">Check Database Table</a></p>
    <p><a href="<?php echo admin_url('admin.php?page=sureconsent'); ?>">Back to SureConsent</a></p>
</body>
</html>