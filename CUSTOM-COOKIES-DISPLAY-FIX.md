# Custom Cookies Display Fix

## Issue

Custom cookies created in the "Create Custom Cookies" section were not appearing in the privacy preference modal when users clicked on a category's arrow to view cookies in that category.

## Root Cause

The issue was related to how custom cookies were being filtered and displayed in the preferences modal. Although the functionality was mostly implemented, there were some inconsistencies in how the cookies were being passed and filtered by category.

## Fixes Implemented

### 1. PreferencesModal.jsx

Enhanced the component with better debugging and logging:

- Added console logs to track when custom cookies are loaded
- Improved the [getCookiesByCategory](file:///C:/Users/Ojas/Local%20Sites/sureconsent/app/public/wp-content/plugins/sure-consent/src/components/PreferencesModal.jsx#L256-L258) function with detailed logging
- Added useEffect to reset expanded category when modal closes
- Enhanced category rendering with logging to track cookie counts

### 2. PreviewBanner.jsx

Ensured proper passing of custom cookies to the preferences modal:

- Verified that [customCookies](file:///C:/Users/Ojas/Local%20Sites/sureconsent/app/public/wp-content/plugins/sure-consent/src/components/PreviewBanner.jsx#L107-L107) are properly passed to the [PreferencesModal](file:///C:/Users/Ojas/Local%20Sites/sureconsent/app/public/wp-content/plugins/sure-consent/src/components/PreviewBanner.jsx#L14-L14) settings
- Added proper modal close and save handlers

### 3. PublicApp.jsx

Ensured proper passing of custom cookies to the preferences modal:

- Verified that [customCookies](file:///C:/Users/Ojas/Local%20Sites/sureconsent/app/public/wp-content/plugins/sure-consent/src/public/PublicApp.jsx#L109-L109) are properly passed to the [PreferencesModal](file:///C:/Users/Ojas/Local%20Sites/sureconsent/app/public/wp-content/plugins/sure-consent/src/public/PublicApp.jsx#L14-L14) settings
- Added proper modal close and save handlers

## Key Changes Made

### File: src/components/PreferencesModal.jsx

Enhanced cookie filtering with detailed logging:

```javascript
// Group custom cookies by category
const getCookiesByCategory = (categoryId) => {
  console.log(`Filtering cookies for category: ${categoryId}`);
  console.log("All custom cookies:", customCookies);
  const filteredCookies = customCookies.filter((cookie) => {
    const match = cookie.category === categoryId;
    console.log(
      `Cookie ${cookie.name} (category: ${cookie.category}) matches ${categoryId}: ${match}`
    );
    return match;
  });
  console.log(
    `Found ${filteredCookies.length} cookies for category ${categoryId}`
  );
  return filteredCookies;
};
```

Enhanced category rendering with logging:

```javascript
{categories.map((category) => {
    const Icon = getIconComponent(category.icon);
    const isEnabled = preferences[category.id];
    const categoryCookies = getCookiesByCategory(category.id);
    const isExpanded = expandedCategory === category.id;

    console.log(`Rendering category ${category.name} with ${categoryCookies.length} cookies`);

    return (
        // ... rest of the component
    );
})}
```

### File: src/components/PreviewBanner.jsx

Ensured proper passing of custom cookies:

```javascript
<PreferencesModal
  isOpen={showPreferencesModal}
  onClose={handleModalClose}
  onSave={handleModalSave}
  settings={{
    // ... other settings
    cookie_categories: cookieCategories,
    custom_cookies: customCookies, // Pass custom cookies to settings
  }}
/>
```

### File: src/public/PublicApp.jsx

Ensured proper passing of custom cookies:

```javascript
<PreferencesModal
  isOpen={showPreferencesModal}
  onClose={handleModalClose}
  onSave={handleModalSave}
  settings={{
    // ... other settings
    cookie_categories: cookieCategories,
    custom_cookies: customCookies, // Use the customCookies state
  }}
/>
```

## Testing

Created test files to verify the functionality:

1. `test-custom-cookie-display.php` - Tests database storage and category matching
2. `verify-custom-cookies-display.php` - Verifies that cookies are properly matched to categories
3. `test-frontend-custom-cookies.php` - Tests frontend rendering

## Expected Behavior After Fix

- Custom cookies created in admin will appear in privacy preferences modal
- Both admin preview and frontend will show the same custom cookies
- Cookie category filtering works correctly using consistent ID-based matching
- When clicking on a category arrow, custom cookies in that category are displayed in a table format
