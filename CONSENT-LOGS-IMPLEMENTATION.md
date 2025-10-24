# Consent Logs Implementation

This document describes the implementation of the Consent Logs feature for the SureConsent plugin.

## Features Implemented

1. **Navigation Icon Update**

   - Replaced BarChart3 icon with Logs icon in the Analytics section
   - Updated AdminApp.jsx to import and use the Logs icon

2. **Layout Update**

   - Updated AdminApp.jsx to apply 1200px max-width to the analytics section (same as cookie-manager)

3. **Consent Logs Component**

   - Created a comprehensive ConsentLogs component with the following features:
     - Table format displaying IP address, visited date, country, consent status
     - Filtering options for consent status, date range, and country
     - Pagination for handling large datasets
     - Expandable rows to show detailed cookie information
     - PDF download functionality for individual consent logs
     - Color-coded consent status indicators (Accepted, Declined, Partially Accepted)

4. **Backend Implementation**
   - Added AJAX handler for fetching consent logs with filtering and pagination
   - Added AJAX handler for generating PDFs for consent logs
   - Ensured consent logs table is created during plugin activation

## Files Modified

1. `src/admin/AdminApp.jsx`

   - Added Logs icon import
   - Updated navigation to use Logs icon for Consent Logs
   - Applied 1200px max-width to analytics section

2. `src/components/ConsentLogs.jsx`

   - Implemented full consent logs table with filtering, pagination, and expandable rows
   - Added PDF download functionality
   - Connected to backend AJAX handlers

3. `admin/class-sure-consent-storage.php`

   - Added `get_consent_logs()` method for fetching logs with filtering and pagination
   - Added `generate_consent_pdf()` method for PDF generation
   - Added country detection functionality (mock implementation)

4. `admin/class-sure-consent-ajax.php`

   - Added AJAX handlers for fetching consent logs and generating PDFs

5. `sure-consent.php`
   - Verified that consent logs table creation is handled during activation

## Database Structure

The consent logs are stored in the `wp_sure_consent_logs` table with the following structure:

- `id` (bigint) - Primary key
- `ip_address` (varchar) - User's IP address
- `user_id` (bigint) - WordPress user ID (if logged in)
- `preferences` (longtext) - JSON-encoded consent preferences
- `action` (varchar) - Consent action (Accepted, Declined, Partially Accepted)
- `timestamp` (datetime) - When the consent was given
- `user_agent` (text) - User's browser user agent
- `version` (varchar) - Plugin version

## API Endpoints

1. `sure_consent_get_consent_logs` - Fetch consent logs with filtering and pagination
2. `sure_consent_generate_consent_pdf` - Generate PDF for a specific consent log

## Future Improvements

1. Implement actual geo-location service for country detection
2. Implement actual PDF generation using a library like TCPDF or mPDF
3. Add more advanced filtering options
4. Add export functionality (CSV, Excel)
5. Add search functionality across all fields
6. Implement data retention policies for GDPR compliance
