import { useState, useEffect } from "react";
import { Switch } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";

const CookieSettings = () => {
  const { getCurrentValue, updateSetting } = useSettings();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleBannerToggle = (checked) => {
    updateSetting("banner_enabled", checked);
  };

  if (isLoading) {
    return (
      <div
        className="bg-white border rounded-lg shadow-sm"
        style={{
          "--tw-border-opacity": 1,
          borderColor: "rgb(229 231 235 / var(--tw-border-opacity))",
        }}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Cookie Settings
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-semibold mb-2" style={{fontSize: '20px', color: '#111827'}}>Cookie Settings</h1>
        <p className="" style={{fontSize: '14px', color: '#4b5563'}}>Manage cookie categories and consent preferences for your website</p>
      </div>
      <div
        className="bg-white border rounded-lg shadow-sm"
        style={{
          "--tw-border-opacity": 1,
          borderColor: "rgb(229 231 235 / var(--tw-border-opacity))",
        }}
      >
        <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border rounded-lg">
          <Switch
            aria-label="Enable Cookie Banner Switch"
            id="cookie-banner-switch"
            label={{
              description:
                "Show cookie consent banner on frontend to comply with privacy regulations",
              heading: "Enable Cookie Banner",
            }}
            onChange={handleBannerToggle}
            size="sm"
            value={getCurrentValue("banner_enabled") || false}
          />
        </div>
        <ActionCard />
        </div>
      </div>
    </div>
  );
};

export default CookieSettings;
