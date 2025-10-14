import { useSettings } from "../contexts/SettingsContext";

const PreviewBanner = () => {
  const { getCurrentValue } = useSettings();
  const previewEnabled = getCurrentValue('preview_enabled');
  const messageHeading = getCurrentValue('message_heading') || '';
  const messageDescription = getCurrentValue('message_description') || 'This website uses cookies to improve your experience. We\'ll assume you\'re ok with this, but you can opt-out if you wish.';

  if (!previewEnabled) return null;

  return (
    <div className="cookie-banner fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="cookie-banner-content max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="cookie-banner-text flex-1">
          {messageHeading && (
            <h3 className="text-base font-semibold mb-2 text-white">{messageHeading}</h3>
          )}
          <p className="text-sm text-white">{messageDescription}</p>
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