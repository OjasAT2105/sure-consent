import { useSettings } from "../contexts/SettingsContext";

const BannerContent = () => {
  const { getCurrentValue, updateSetting } = useSettings();

  const handleHeadingChange = (e) => {
    updateSetting('message_heading', e.target.value);
  };

  const handleDescriptionChange = (e) => {
    updateSetting('message_description', e.target.value);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Banner Content</h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Heading
          </label>
          <textarea
            value={getCurrentValue('message_heading') || ''}
            onChange={handleHeadingChange}
            placeholder="Enter banner heading (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Description
          </label>
          <textarea
            value={getCurrentValue('message_description') || ''}
            onChange={handleDescriptionChange}
            placeholder="Enter banner description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default BannerContent;