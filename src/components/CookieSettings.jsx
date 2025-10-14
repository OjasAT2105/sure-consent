import { useState, useEffect } from "react";
import { Switch } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";

const CookieSettings = () => {
  const { getCurrentValue, updateSetting } = useSettings();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleBannerToggle = (checked) => {
    updateSetting('banner_enabled', checked);
  };

  const handlePreviewToggle = (checked) => {
    updateSetting('preview_enabled', checked);
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
            checked={getCurrentValue('banner_enabled') || false}
            onChange={handleBannerToggle}
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
            checked={getCurrentValue('preview_enabled') || false}
            onChange={handlePreviewToggle}
          />
        </div>

      </div>
    </div>
  );
};

export default CookieSettings;