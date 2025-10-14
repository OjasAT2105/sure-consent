import React, { useState } from 'react';

const PublicApp = () => {
  const [showBanner, setShowBanner] = useState(true);

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
          <p className="text-sm">
            We use cookies to enhance your browsing experience and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
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