import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    console.log("Loading settings...", {
      ajaxurl: window.sureConsentAjax?.ajaxurl,
      nonce: window.sureConsentAjax?.nonce,
    });
    try {
      const response = await fetch(
        window.sureConsentAjax?.ajaxurl || "/wp-admin/admin-ajax.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "sure_consent_get_settings",
            nonce: window.sureConsentAjax?.nonce || "",
          }),
        }
      );

      const data = await response.json();
      console.log("AJAX response:", data);
      if (data.success) {
        // Ensure all values are properly processed
        const processedSettings = { ...data.data };
        console.log("Raw settings from server:", data.data);

        // Log custom_cookies specifically
        console.log("custom_cookies from server:", data.data.custom_cookies);
        console.log("custom_cookies type:", typeof data.data.custom_cookies);
        console.log(
          "custom_cookies is array:",
          Array.isArray(data.data.custom_cookies)
        );

        // Convert boolean values
        if (typeof processedSettings.preview_enabled === "string") {
          processedSettings.preview_enabled =
            processedSettings.preview_enabled === "1" ||
            processedSettings.preview_enabled === "true" ||
            processedSettings.preview_enabled === true;
        } else if (typeof processedSettings.preview_enabled === "boolean") {
          // Keep it as is
        } else {
          // Default to false if not set
          processedSettings.preview_enabled = false;
        }
        // Ensure all other values are strings (not null/undefined)
        // But preserve arrays and objects
        Object.keys(processedSettings).forEach((key) => {
          if (
            processedSettings[key] === null ||
            processedSettings[key] === undefined
          ) {
            // Don't convert arrays or objects to empty strings
            if (
              !(
                Array.isArray(processedSettings[key]) ||
                typeof processedSettings[key] === "object"
              )
            ) {
              processedSettings[key] = "";
            }
          }
        });
        console.log("Processed settings:", processedSettings);
        console.log(
          "cookie_categories type:",
          typeof processedSettings.cookie_categories
        );
        console.log(
          "cookie_categories value:",
          processedSettings.cookie_categories
        );
        console.log("custom_cookies value:", processedSettings.custom_cookies);
        setSettings(processedSettings);
        setIsLoaded(true);
      } else {
        console.error(
          "Failed to load settings - response not successful:",
          data
        );
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      setIsLoaded(true); // Set loaded even on error to prevent infinite loading
    }
  };

  const updateSetting = (key, value) => {
    console.log("SettingsContext - updateSetting:", key, value);
    setPendingChanges((prev) => ({
      ...prev,
      [key]: value,
    }));

    // For preview_enabled and custom_cookies, also update settings immediately for instant UI feedback
    // and save immediately to backend
    if (key === "preview_enabled" || key === "custom_cookies") {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
      // Also save immediately to backend
      saveSettingImmediately(key, value);
    }

    setHasChanges(true);
  };

  const saveSettingImmediately = async (key, value) => {
    try {
      const response = await fetch(
        window.sureConsentAjax?.ajaxurl || "/wp-admin/admin-ajax.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "sure_consent_save_all_settings",
            nonce: window.sureConsentAjax?.nonce || "",
            settings: JSON.stringify({ [key]: value }),
          }),
        }
      );

      const data = await response.json();
      console.log("Immediate save response for", key, ":", data);
    } catch (error) {
      console.error("Failed to save setting immediately:", error);
    }
  };

  const saveSettings = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      return { success: true, message: "No changes to save" };
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        window.sureConsentAjax?.ajaxurl || "/wp-admin/admin-ajax.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "sure_consent_save_all_settings",
            nonce: window.sureConsentAjax?.nonce || "",
            settings: JSON.stringify(pendingChanges),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update settings with the saved changes
        const updatedSettings = { ...settings, ...pendingChanges };
        setSettings(updatedSettings);
        setPendingChanges({});
        setHasChanges(false);

        // Reload settings from database to ensure we have the latest
        console.log("saveSettings - Reloading from database to verify save...");
        setTimeout(() => {
          loadSettings();
        }, 500);

        return { success: true, message: data.data.message };
      } else {
        return {
          success: false,
          message: data.data || "Failed to save settings",
        };
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      return { success: false, message: "Network error occurred" };
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentValue = (key) => {
    const value = pendingChanges.hasOwnProperty(key)
      ? pendingChanges[key]
      : settings[key];
    return value;
  };

  const value = {
    settings,
    hasChanges,
    isSaving,
    isLoaded,
    updateSetting,
    saveSettings,
    getCurrentValue,
    loadSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
