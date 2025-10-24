# Consent Logging Test Guide

This guide explains how to test the consent logging functionality in SureConsent.

## Issues Fixed

1. **AJAX Handler Initialization**: Added proper initialization of the `Sure_Consent_Storage` class to register AJAX handlers
2. **Nonce Verification**: Added nonce verification to the `save_consent` method for security
3. **AJAX Request Improvements**: Enhanced the JavaScript AJAX request with better error handling and debugging
4. **Public Asset Localization**: Ensured the AJAX configuration is properly passed to the public-facing JavaScript

## Testing Steps

### 1. Verify Plugin Installation

- Make sure the plugin is activated
- Check that the consent logs table exists in the database

### 2. Test Consent Saving

- Open your website in an incognito/private browser window
- You should see the cookie consent banner
- Click "Accept", "Accept All", or "Decline"
- Check the browser console for success messages

### 3. Verify Database Storage

- Access your WordPress admin panel
- Navigate to SureConsent → Analytics → Consent Logs
- You should see the consent logs in the table

### 4. Manual Database Verification

- You can also manually check the database by visiting:
  `http://yoursite.com/wp-content/plugins/sure-consent/test-consent-logs.php`
- This page will show the latest 10 consent logs

## Troubleshooting

### If Consents Still Aren't Logging:

1. **Check Browser Console**: Look for JavaScript errors when giving consent
2. **Check Server Logs**: Look for PHP errors in your server error logs
3. **Verify AJAX Configuration**: Ensure `sureConsentAjax` is properly defined in the public assets
4. **Check Database Permissions**: Ensure WordPress can write to the database
5. **Verify Table Creation**: Make sure the `wp_sure_consent_logs` table exists

### Common Issues and Solutions:

1. **Nonce Verification Failed**:

   - Ensure the nonce is being passed correctly from JavaScript
   - Check that `wp_localize_script` is properly configured

2. **AJAX Request Fails**:

   - Verify the AJAX URL is correct
   - Check for CORS issues
   - Ensure the action names match between JavaScript and PHP

3. **Database Not Updated**:
   - Check database permissions
   - Verify the table structure matches expectations
   - Ensure the `wpdb->insert` call is working correctly

## Debugging Tips

1. **Enable WordPress Debug Mode**:
   Add these lines to your `wp-config.php`:

   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```

2. **Check Error Logs**:
   Look in `wp-content/debug.log` for any errors

3. **Browser Developer Tools**:

   - Check the Network tab to see if AJAX requests are being made
   - Check the Console tab for JavaScript errors
   - Check the Application tab to verify cookies are being set

4. **Test AJAX Endpoint Directly**:
   You can test the AJAX endpoint by making a POST request to:
   `http://yoursite.com/wp-admin/admin-ajax.php`
   With the parameters:
   - action: `sure_consent_save_consent`
   - nonce: [your nonce]
   - preferences: `{"essential":true,"analytics":false,"marketing":false}`
   - action_type: `partially_accepted`
