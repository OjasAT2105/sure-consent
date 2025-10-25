# Geo-targeting Logic Example

This document provides an example of how to implement geo-targeting logic in the frontend to determine whether to show the cookie consent banner based on the user's location.

## Frontend Implementation

In a real implementation, you would integrate with a geo IP service to determine the user's country. Here's an example of how this could be implemented:

```javascript
// Function to check if banner should be shown based on geo rules
const shouldShowBannerBasedOnGeo = async (
  geoRuleType,
  geoSelectedCountries
) => {
  // If geo rule is worldwide, always show banner
  if (geoRuleType === "worldwide") {
    return true;
  }

  // Get user's country using a geo IP service
  const getUserCountry = async () => {
    try {
      // Using ipapi.co service (free tier available)
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return data.country_code;
    } catch (error) {
      console.error("Failed to get user country:", error);
      // Fallback to a default country or show banner
      return null;
    }
  };

  const userCountry = await getUserCountry();

  // If we can't determine the user's country, show the banner by default
  if (!userCountry) {
    return true;
  }

  if (geoRuleType === "eu_only") {
    // EU countries list
    const euCountries = [
      "AT",
      "BE",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IE",
      "IT",
      "LV",
      "LT",
      "LU",
      "MT",
      "NL",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
      "GB",
    ];
    return euCountries.includes(userCountry);
  }

  if (geoRuleType === "selected") {
    return geoSelectedCountries.includes(userCountry);
  }

  // Default to showing banner
  return true;
};

// Usage example
const checkAndShowBanner = async () => {
  // These values would come from your plugin settings
  const geoRuleType = "selected"; // "worldwide", "eu_only", or "selected"
  const geoSelectedCountries = ["US", "CA", "GB"]; // Array of country codes

  const shouldShow = await shouldShowBannerBasedOnGeo(
    geoRuleType,
    geoSelectedCountries
  );

  if (shouldShow) {
    // Show the cookie consent banner
    document.getElementById("cookie-banner").style.display = "block";
  } else {
    // Hide the banner
    document.getElementById("cookie-banner").style.display = "none";
  }
};

// Call the function when the page loads
checkAndShowBanner();
```

## Backend Integration

The geo settings are stored in the WordPress options table:

1. `sure_consent_geo_rule_type` - String: "worldwide", "eu_only", or "selected"
2. `sure_consent_geo_selected_countries` - JSON array of country codes: ["US", "CA", "GB"]

You can retrieve these settings in your frontend code by making an AJAX request to the `sure_consent_get_public_settings` endpoint.

## Country Code Reference

Here are some common country codes you might use:

- US: United States
- CA: Canada
- GB: United Kingdom
- DE: Germany
- FR: France
- IT: Italy
- ES: Spain
- JP: Japan
- AU: Australia
- BR: Brazil

For a complete list of ISO 3166-1 alpha-2 country codes, refer to:
https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

## Geo IP Services

Some popular geo IP services:

1. **ipapi.co** - Free tier available, easy to use
2. **ipinfo.io** - Free tier with good accuracy
3. **MaxMind GeoIP2** - More comprehensive but requires setup
4. **Cloudflare** - If you're using Cloudflare, you can access `cf-ipcountry` header

Example with ipapi.co:

```javascript
fetch("https://ipapi.co/json/")
  .then((response) => response.json())
  .then((data) => {
    console.log("Country:", data.country_code);
    console.log("Region:", data.region);
    console.log("City:", data.city);
  });
```

## Implementation Notes

1. Always have a fallback to show the banner if geo IP lookup fails
2. Cache the geo IP result to avoid repeated requests
3. Consider privacy implications of geo IP lookups
4. Test thoroughly with different country codes
5. Ensure your geo IP service complies with privacy regulations
