# SureConsent - Cookie Consent API Documentation

## Overview

SureConsent provides a comprehensive cookie consent management system that allows you to control which scripts and cookies execute based on user consent.

## How It Works

### 1. User Consent Flow

1. User visits the website → Cookie banner appears
2. User can:
   - **Accept** → Accepts essential cookies only
   - **Decline** → Declines all cookies except essential
   - **Preferences** → Choose specific categories (Essential, Functional, Analytics, Marketing)
3. Consent is saved in cookie: `sureconsent_user_consent`
4. Scripts with `data-consent` attribute are executed based on consent

### 2. Cookie Storage

Consent data is stored in a cookie named `sureconsent_user_consent` for 365 days.

**Cookie Structure:**

```json
{
  "preferences": {
    "essential": true,
    "functional": false,
    "analytics": true,
    "marketing": false
  },
  "action": "custom",
  "timestamp": "2025-01-22T10:30:00.000Z",
  "version": "1.0"
}
```

## JavaScript API

### Access the Consent Manager

```javascript
// The ConsentManager is available globally
const consentManager = window.SureConsentManager;
```

### Check if User Has Given Consent

```javascript
if (consentManager.hasConsent()) {
  console.log("User has given consent");
}
```

### Get Current Consent Data

```javascript
const consent = consentManager.getConsent();
console.log(consent);
// Returns: { preferences: {...}, action: 'custom', timestamp: '...', version: '1.0' }
```

### Check Specific Category

```javascript
if (consentManager.isAllowed("analytics")) {
  // Load analytics script
  console.log("Analytics allowed");
}

if (consentManager.isAllowed("marketing")) {
  // Load marketing scripts
  console.log("Marketing allowed");
}
```

### Listen for Consent Changes

```javascript
window.addEventListener("sureconsent_changed", (event) => {
  console.log("Consent changed:", event.detail);
  // Reload or update your scripts
});

window.addEventListener("sureconsent_applied", (event) => {
  console.log("Consent applied:", event.detail);
  // All blocked scripts have been processed
});
```

## HTML/Script Blocking

### Block Scripts Until Consent

Use the `data-consent` attribute to block scripts until user gives consent:

```html
<!-- This Google Analytics script will only load if user consents to 'analytics' -->
<script
  type="text/plain"
  data-consent="analytics"
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>

<!-- Inline script example -->
<script type="text/plain" data-consent="analytics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Facebook Pixel -->
<script type="text/plain" data-consent="marketing">
  !function(f,b,e,v,n,t,s){...}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>

<!-- Functional cookie example -->
<script type="text/plain" data-consent="functional">
  // Live chat widget
  var Tawk_API = Tawk_API || {};
  // ... Tawk.to code
</script>
```

### Categories

- `essential` - Always allowed (cannot be declined)
- `functional` - Features like live chat, saved preferences
- `analytics` - Google Analytics, heatmaps, usage tracking
- `marketing` - Ad tracking, remarketing pixels, social media pixels

## PHP API

### Check User Consent in PHP

```php
<?php
// Check if user has given consent
if (Sure_Consent_Cookies::has_consent()) {
    echo 'User has consented';
}

// Check specific category
if (Sure_Consent_Cookies::is_allowed('analytics')) {
    // Load analytics tracking
}

// Get full consent data
$consent = Sure_Consent_Cookies::get_user_consent();
print_r($consent);
```

### Conditionally Load Scripts in PHP

```php
<?php
// Method 1: Using helper function
Sure_Consent_Cookies::script_tag('analytics', 'https://analytics.example.com/script.js');

// Method 2: Inline script
Sure_Consent_Cookies::script_tag('marketing', '', '
  console.log("Marketing script loaded");
  // Your inline code here
');

// Method 3: Manual check
if (Sure_Consent_Cookies::is_allowed('functional')) {
    wp_enqueue_script('my-chat-widget', 'https://chat.example.com/widget.js');
}
?>
```

## WordPress Integration Examples

### Example 1: Google Analytics

```php
<?php
// In your theme's functions.php or plugin
add_action('wp_footer', 'my_google_analytics');
function my_google_analytics() {
    if (!Sure_Consent_Cookies::is_allowed('analytics')) {
        return; // User hasn't consented to analytics
    }
    ?>
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    <?php
}
```

### Example 2: Facebook Pixel

```php
<?php
add_action('wp_head', 'my_facebook_pixel');
function my_facebook_pixel() {
    // Block until user consents to marketing
    Sure_Consent_Cookies::script_tag('marketing', '', "
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
    ");
}
```

### Example 3: JavaScript-based Loading

```javascript
// Check consent before initializing third-party services
document.addEventListener("DOMContentLoaded", function () {
  const consentManager = window.SureConsentManager;

  // Load analytics if allowed
  if (consentManager.isAllowed("analytics")) {
    loadGoogleAnalytics();
  }

  // Load marketing pixels if allowed
  if (consentManager.isAllowed("marketing")) {
    loadFacebookPixel();
    loadGoogleAds();
  }

  // Load functional features if allowed
  if (consentManager.isAllowed("functional")) {
    loadLiveChat();
  }
});

function loadGoogleAnalytics() {
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=GA_ID";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "GA_ID");
  };
}
```

## Advanced Usage

### Clear Consent (for testing)

```javascript
window.SureConsentManager.clearConsent();
// Banner will appear again on next page load
```

### Programmatically Save Consent

```javascript
const preferences = {
  essential: true,
  functional: true,
  analytics: false,
  marketing: false,
};

window.SureConsentManager.saveCustomPreferences(preferences);
```

### Get Consent Summary

```javascript
const summary = window.SureConsentManager.getConsentSummary();
console.log(summary);
// Returns: { action: 'custom', timestamp: '...', allowed: ['essential', 'functional'], preferences: {...} }
```

## Testing

### Test Different Consent Scenarios

```javascript
// Scenario 1: Accept all
window.SureConsentManager.clearConsent();
// Reload page, click "Accept All"

// Scenario 2: Decline all
window.SureConsentManager.clearConsent();
// Reload page, click "Decline"

// Scenario 3: Custom preferences
window.SureConsentManager.clearConsent();
// Reload page, click "Preferences", select specific categories
```

### Browser Console Testing

```javascript
// Check current state
console.log("Has consent:", window.SureConsentManager.hasConsent());
console.log("Consent data:", window.SureConsentManager.getConsent());
console.log(
  "Analytics allowed:",
  window.SureConsentManager.isAllowed("analytics")
);

// Manually save consent
window.SureConsentManager.saveConsent(
  {
    essential: true,
    functional: true,
    analytics: true,
    marketing: false,
  },
  "custom"
);
```

## Best Practices

1. **Always check consent before loading third-party scripts**
2. **Use appropriate categories:**

   - `essential` - Core functionality only
   - `functional` - Enhanced features (chat, preferences)
   - `analytics` - Usage tracking, heatmaps
   - `marketing` - Ads, remarketing, social pixels

3. **Handle consent changes dynamically**

   ```javascript
   window.addEventListener("sureconsent_changed", () => {
     // Re-initialize services based on new consent
     location.reload(); // Simple approach
   });
   ```

4. **Provide clear descriptions** in the Cookie Categories admin panel

5. **Test thoroughly** in both admin preview and frontend

## Troubleshooting

**Scripts not loading after consent?**

- Check browser console for errors
- Verify `data-consent` attribute matches category ID exactly
- Ensure ConsentManager is loaded: `console.log(window.SureConsentManager)`

**Consent not persisting?**

- Check browser cookies are enabled
- Verify cookie `sureconsent_user_consent` exists in DevTools
- Check cookie expiry (default 365 days)

**Banner showing after consent given?**

- Clear browser cookies and test again
- Check console for `hasConsent()` return value
- Verify consent cookie is being saved correctly

## Support

For issues or questions, check the plugin documentation or contact support.
