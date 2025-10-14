import React, { useState, useEffect } from 'react';

const PublicApp = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [messageHeading, setMessageHeading] = useState('');
  const [messageDescription, setMessageDescription] = useState('This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'sure_consent_get_public_settings',
          nonce: window.sureConsentAjax?.nonce || ''
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessageHeading(data.data.message_heading || '');
        setMessageDescription(data.data.message_description || 'This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleAccept = () => {
    setShowBanner(false);
    // Add cookie consent logic here
  };

  const handleDecline = () => {
    setShowBanner(false);
    // Add cookie decline logic here
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="cookie-banner-content max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="cookie-banner-text flex-1">
          {messageHeading && (
            <h3 className="text-base font-semibold mb-2">{messageHeading}</h3>
          )}
          <p className="text-sm">{messageDescription}</p>
        </div>
        <div className="cookie-banner-buttons flex gap-3">
          <button
            onClick={handleDecline}
            className="cookie-banner-button cookie-banner-button-decline px-4 py-2 text-sm border border-gray-500 rounded hover:bg-gray-700 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="cookie-banner-button cookie-banner-button-accept px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicApp;