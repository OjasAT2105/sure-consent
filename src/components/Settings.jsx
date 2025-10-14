import { useState, useEffect } from "react";
import { Container, Switch } from "@bsf/force-ui";

const Settings = () => {
  const [bannerEnabled, setBannerEnabled] = useState(false);

  useEffect(() => {
    // Load current setting from WordPress
    fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'sure_consent_get_banner_status',
        nonce: window.sureConsentAjax?.nonce || ''
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setBannerEnabled(data.data.enabled);
      }
    });
  }, []);

  const handleToggle = (checked) => {
    setBannerEnabled(checked);
    // Save to WordPress options
    fetch(window.sureConsentAjax?.ajaxurl || '/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'sure_consent_toggle_banner',
        enabled: checked ? '1' : '0',
        nonce: window.sureConsentAjax?.nonce || ''
      })
    })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        // Revert on error
        setBannerEnabled(!checked);
      }
    });
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable Banner</h3>
            <p className="text-sm text-gray-600">Show consent banner on frontend</p>
          </div>
          <Switch
            checked={bannerEnabled}
            onChange={handleToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;