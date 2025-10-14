import { useState, useEffect } from "react";

const PreviewBanner = () => {
  const [previewEnabled, setPreviewEnabled] = useState(false);

  useEffect(() => {
    const fetchPreviewStatus = async () => {
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
          setPreviewEnabled(data.data.preview);
        }
      } catch (error) {
        console.error('Failed to fetch preview status:', error);
      }
    };

    fetchPreviewStatus();
    
    // Poll for preview status changes
    const interval = setInterval(fetchPreviewStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!previewEnabled) return null;

  return (
    <div className="cookie-banner fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="cookie-banner-content max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="cookie-banner-text flex-1">
          <p className="text-sm">
            We use cookies to enhance your browsing experience and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="cookie-banner-buttons flex gap-3">
          <button className="cookie-banner-button cookie-banner-button-decline px-4 py-2 text-sm border border-gray-500 rounded hover:bg-gray-700 transition-colors">
            Decline
          </button>
          <button className="cookie-banner-button cookie-banner-button-accept px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewBanner;