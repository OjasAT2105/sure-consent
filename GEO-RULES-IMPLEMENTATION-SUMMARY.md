# Geo Rules Implementation Summary

This document summarizes the implementation of the Geo Rules feature for the SureConsent plugin.

## Components Implemented

### 1. React Component (`src/components/GeoRules.jsx`)

- Created a new React component for the Geo Rules settings page
- Implemented three radio button options:
  - Worldwide (show banner everywhere)
  - EU Countries only (show banner only for EU/EEA countries)
  - Selected Countries (show banner only for specific countries)
- Added a multi-select checkbox list for country selection when "Selected Countries" is chosen
- Included "Select All" and "Deselect All" buttons for easier country selection
- Integrated with the existing SettingsContext for state management
- Added save functionality using the existing saveSettings method

### 2. PHP Settings Handler (`admin/class-sure-consent-settings.php`)

- Added two new settings to the `$settings` array:
  - `geo_rule_type`: String value ("worldwide", "eu_only", or "selected")
  - `geo_selected_countries`: Array of selected country codes
- Updated `get_all_settings()` method to properly handle the new settings
- Updated `get_setting()` method to properly handle the new settings
- Updated `update_setting()` method to properly handle the new settings
- Added `get_eu_countries()` method to return the list of EU/EEA countries

### 3. PHP AJAX Handler (`admin/class-sure-consent-ajax.php`)

- Updated `save_all_settings()` method to handle the new geo settings
- Updated `get_settings()` method to include the new geo settings in the admin response
- Updated `get_public_settings()` method to include the new geo settings in the public response

### 4. Frontend Logic (`src/public/PublicApp.jsx`)

- Added state variables for geo settings (`geoRuleType`, `geoSelectedCountries`)
- Updated the settings fetch to include geo settings
- Added `shouldShowBannerBasedOnGeo()` function to determine if the banner should be shown based on geo rules
- Integrated geo logic into the main useEffect that determines banner visibility
- Added EU countries list for client-side geo checking

## Database Settings

The implementation uses WordPress options to store the geo settings:

1. `sure_consent_geo_rule_type` - String: "worldwide", "eu_only", or "selected"
2. `sure_consent_geo_selected_countries` - JSON-encoded array of country codes

## Country Codes

The implementation includes a comprehensive list of country codes for selection, including:

- All EU/EEA countries (27 countries)
- Common countries like US, CA, AU, JP, etc.

## Frontend Geo Logic

The frontend implementation includes logic to determine whether to show the banner based on the user's location. In a production environment, this would integrate with a geo IP service to determine the user's country.

## Navigation

The Geo Rules tab is available under the "Advanced" section in the admin interface.

## Usage

1. Navigate to Advanced → Geo Rules in the admin panel
2. Select the desired geo rule type
3. If "Selected Countries" is chosen, select the countries where the banner should be shown
4. Save the settings
5. The frontend will automatically respect these settings when determining whether to show the banner

## Example Frontend Implementation

For a complete example of how to implement geo IP lookup in the frontend, see the `GEO-LOGIC-EXAMPLE.md` file.
