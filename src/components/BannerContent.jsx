import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";

const BannerContent = () => {
  const { getCurrentValue, updateSetting } = useSettings();

  const handleHeadingChange = (e) => {
    updateSetting('message_heading', e.target.value);
  };

  const handleDescriptionChange = (e) => {
    updateSetting('message_description', e.target.value);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-semibold mb-2" style={{fontSize: '20px', color: '#111827'}}>Banner Content</h1>
        <p className="" style={{fontSize: '14px', color: '#4b5563'}}>Configure the text content that appears in your cookie consent banner</p>
      </div>
      <div className="bg-white border rounded-lg shadow-sm" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
        <div className="p-6 space-y-6">
        <div>
          <label className="block font-medium mb-2" style={{fontSize: '14px', color: '#111827'}}>
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
          <label className="block font-medium mb-2" style={{fontSize: '14px', color: '#111827'}}>
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
        <ActionCard />
        </div>
      </div>
    </div>
  );
};

export default BannerContent;