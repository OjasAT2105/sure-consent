import { useState, useEffect } from "react";
import { Switch, Input } from "@bsf/force-ui";
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

  const handleConsentLoggingToggle = (checked) => {
    updateSetting("consent_logging_enabled", checked);
  };

  const handleConsentDurationChange = (value) => {
    // Ensure the value is a number between 1 and 3650
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 3650) {
      updateSetting("consent_duration_days", numValue);
    }
  };

  // Generate dynamic link to analytics tab
  const getAnalyticsLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?page=sureconsent&tab=analytics`;
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
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Cookie Settings
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Manage cookie categories and consent preferences for your website
        </p>
      </div>
      <div
        className="bg-white border rounded-lg shadow-sm"
        style={{
          "--tw-border-opacity": 1,
          borderColor: "rgb(229 231 235 / var(--tw-border-opacity))",
        }}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between ">
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
          <div className="flex items-center justify-between ">
            <Switch
              aria-label="Enable Consent Logging Switch"
              id="consent-logging-switch"
              label={{
                description:
                  "Store consent records in database for compliance reporting and analytics",
                heading: "Enable Consent Logging",
              }}
              onChange={handleConsentLoggingToggle}
              size="sm"
              value={getCurrentValue("consent_logging_enabled") ?? false}
            />
          </div>

          {/* Consent Duration Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Consent Duration (in days)</h3>
              <p className="text-sm text-gray-600">
                How long user consent remains valid before requiring renewal
                (1-3650 days)
              </p>
            </div>
            <div className="w-32">
              <Input
                type="number"
                min="1"
                max="3650"
                value={getCurrentValue("consent_duration_days") || 365}
                onChange={(value) => handleConsentDurationChange(value)}
                placeholder="365"
              />
            </div>
          </div>

          {/* Message with dynamic link to analytics tab */}
          {getCurrentValue("consent_logging_enabled") && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Consent logging is now enabled.{" "}
                <a
                  href={getAnalyticsLink()}
                  className="font-semibold text-blue-600 hover:text-blue-800 underline"
                >
                  View consent logs in the Analytics tab
                </a>
              </p>
            </div>
          )}

          <ActionCard />
        </div>
      </div>
    </div>
  );
};

export default CookieSettings;
