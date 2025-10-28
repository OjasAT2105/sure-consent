# Scheduled Scans Documentation

## Overview

The Sure Consent plugin includes a scheduled scan feature that allows you to automatically scan your website for cookies at regular intervals. When a scheduled scan is due, the system will automatically redirect to the scan page and trigger the scan.

## How It Works

1. **Schedule Creation**: Users can create scheduled scans through the admin interface, specifying:

   - Frequency (daily, weekly, monthly)
   - Start date and time
   - Optional end date

2. **Cron Job System**: The plugin uses WordPress cron jobs to check for scheduled scans every minute.

3. **Automatic Triggering**: When a scheduled scan is due, the system:
   - Sets a redirect flag in the WordPress options table
   - Redirects to the scan cookies page
   - Automatically triggers the scan
   - Shows completion notifications

## Implementation Details

### Database Structure

The scheduled scans are stored in the `wp_sure_consent_scheduled_scans` table with the following fields:

- `id`: Unique identifier
- `frequency`: Scan frequency (daily, weekly, monthly)
- `start_date`: Date when scanning should start
- `start_time`: Time when scanning should start
- `end_date`: Optional end date for scanning
- `created_at`: Timestamp when the schedule was created
- `updated_at`: Timestamp when the schedule was last updated

### Cron Job

The plugin schedules a cron job that runs every minute to check for due scans:

- Hook: `sure_consent_check_scheduled_scans`
- Frequency: Every minute
- Function: `Sure_Consent_Storage::check_scheduled_scans()`

### Redirect Mechanism

When a scan is due:

1. The cron job sets a redirect flag in the options table
2. The frontend checks for this flag on page load
3. If found, it redirects to the scan page with an auto_scan parameter
4. The scan page automatically triggers the scan when this parameter is present

## Testing

To test the scheduled scan functionality:

1. **Add a Test Schedule**:
   Visit `/wp-content/plugins/sure-consent/test-scheduled-scan.php` to add a test schedule that should run immediately.

2. **Trigger Manual Check**:
   Visit `/wp-content/plugins/sure-consent/trigger-scheduled-scan-check.php` to manually trigger the scheduled scan checking.

3. **Verify Functionality**:
   - Check that the redirect flag is set in the database
   - Visit the Scan Cookies page to see if the scan is automatically triggered
   - Check that completion notifications appear

## Troubleshooting

### Scheduled Scans Not Running

1. Check that the WordPress cron system is working
2. Verify that the `sure_consent_check_scheduled_scans` cron job is scheduled
3. Check the WordPress debug log for errors
4. Ensure the scheduled scan start time has passed

### Automatic Scanning Not Triggering

1. Verify that the redirect flag is being set in the database
2. Check that the frontend is properly checking for the redirect flag
3. Ensure the scan page has the auto_scan parameter when redirected

## API Endpoints

### AJAX Actions

- `sure_consent_save_scheduled_scan`: Save a new scheduled scan
- `sure_consent_update_scheduled_scan`: Update an existing scheduled scan
- `sure_consent_delete_scheduled_scan`: Delete a scheduled scan
- `sure_consent_get_scheduled_scans`: Get all scheduled scans

### Storage Methods

- `Sure_Consent_Storage::get_scheduled_scans()`: Get all scheduled scans
- `Sure_Consent_Storage::save_scheduled_scan()`: Save a new scheduled scan
- `Sure_Consent_Storage::update_scheduled_scan()`: Update an existing scheduled scan
- `Sure_Consent_Storage::delete_scheduled_scan()`: Delete a scheduled scan
- `Sure_Consent_Storage::check_scheduled_scans()`: Check for due scheduled scans
- `Sure_Consent_Storage::check_scheduled_scan_redirect()`: Check for redirect flag
