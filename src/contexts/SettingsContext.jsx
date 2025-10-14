import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  // Load initial settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(window.sureConsentAjax?.ajaxurl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'sure_consent_get_settings',
          nonce: window.sureConsentAjax?.nonce || ''
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateSetting = (key, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      return { success: true, message: 'No changes to save' };
    }

    setIsSaving(true);
    
    try {
      const response = await fetch(window.sureConsentAjax?.ajaxurl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'sure_consent_save_all_settings',
          nonce: window.sureConsentAjax?.nonce || '',
          settings: JSON.stringify(pendingChanges)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(prev => ({ ...prev, ...pendingChanges }));
        setPendingChanges({});
        setHasChanges(false);
        return { success: true, message: data.data.message };
      } else {
        return { success: false, message: data.data || 'Failed to save settings' };
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      return { success: false, message: 'Network error occurred' };
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentValue = (key) => {
    return pendingChanges.hasOwnProperty(key) ? pendingChanges[key] : settings[key];
  };

  const value = {
    settings,
    hasChanges,
    isSaving,
    updateSetting,
    saveSettings,
    getCurrentValue
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};