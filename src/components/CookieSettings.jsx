import { useState, useEffect } from "react";
import { Switch, Button } from "@bsf/force-ui";
import { useAppState } from "../admin/AdminApp";

const CookieSettings = () => {
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalState, setOriginalState] = useState({ banner: false, preview: false });
  const { setHasChanges } = useAppState() || {};

  // Load current setting on component mount
  useEffect(() => {
    fetchBannerStatus();
  }, []);

  const fetchBannerStatus = async () => {
    try {
      const response = await fetch(window.sureConsentAjax?.ajaxurl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'sure_consent_get_banner_status',
          nonce: window.sureConsentAjax?.nonce || ''
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setBannerEnabled(data.data.enabled);
        setPreviewEnabled(data.data.preview);
        setOriginalState({ banner: data.data.enabled, preview: data.data.preview });
      }
    } catch (error) {
      console.error('Failed to fetch banner status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerToggle = (checked) => {
    setBannerEnabled(checked);
    checkForChanges(checked, previewEnabled);
  };

  const handlePreviewToggle = async (checked) => {
    setPreviewEnabled(checked);
    checkForChanges(bannerEnabled, checked);
    
    // Save preview state immediately
    try {
      await fetch(window.sureConsentAjax?.ajaxurl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'sure_consent_toggle_preview',
          enabled: checked ? '1' : '0',
          nonce: window.sureConsentAjax?.nonce || ''
        })
      });
    } catch (error) {
      console.error('Failed to save preview state:', error);
    }
  };

  const checkForChanges = (banner, preview) => {
    const hasChanges = banner !== originalState.banner || preview !== originalState.preview;
    setHasChanges?.(hasChanges);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch(window.sureConsentAjax?.ajaxurl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'sure_consent_toggle_banner',
          enabled: bannerEnabled ? '1' : '0',
          nonce: window.sureConsentAjax?.nonce || ''
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setOriginalState({ banner: bannerEnabled, preview: previewEnabled });
        setHasChanges?.(false);
      } else {
        // Revert on error
        setBannerEnabled(originalState.banner);
        console.error('Failed to save settings');
      }
    } catch (error) {
      // Revert on error
      setBannerEnabled(originalState.banner);
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border rounded-lg shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Cookie Settings</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Cookie Settings</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Enable Cookie Banner</h3>
            <p className="text-sm text-gray-600 mt-1">
              Show cookie consent banner on frontend to comply with privacy regulations
            </p>
          </div>
          <Switch
            checked={bannerEnabled}
            onChange={handleBannerToggle}
            disabled={isSaving}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Preview Banner</h3>
            <p className="text-sm text-gray-600 mt-1">
              Show banner preview in admin area for testing
            </p>
          </div>
          <Switch
            checked={previewEnabled}
            onChange={handlePreviewToggle}
            disabled={isSaving}
          />
        </div>
        

        
        {(bannerEnabled !== originalState.banner) && (
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieSettings;