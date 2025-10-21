import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";

const BannerContent = () => {
  const { getCurrentValue, updateSetting } = useSettings();

  const defaultGDPRMessage =
    "We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies. You can learn more about how we use cookies in our Privacy Policy.";

  const handleHeadingChange = (e) => {
    updateSetting("message_heading", e.target.value);
  };

  const handleDescriptionChange = (e) => {
    updateSetting("message_description", e.target.value);
  };

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Banner Content
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Configure the text content that appears in your cookie consent banner
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
          <div>
            <label
              className="block font-medium mb-2"
              style={{ fontSize: "14px", color: "#111827" }}
            >
              Message Heading (GDPR)
            </label>
            <textarea
              value={getCurrentValue("message_heading") || ""}
              onChange={handleHeadingChange}
              placeholder="Cookie Notice (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div>
            <label
              className="block font-medium mb-2"
              style={{ fontSize: "14px", color: "#111827" }}
            >
              Message Description (GDPR)
            </label>
            <textarea
              value={
                getCurrentValue("message_description") || defaultGDPRMessage
              }
              onChange={handleDescriptionChange}
              placeholder={defaultGDPRMessage}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <p className="mt-2 text-xs text-gray-500">
              Default GDPR-compliant message is provided. You can customize it
              as needed.
            </p>
          </div>
          <ActionCard />
        </div>
      </div>
    </div>
  );
};

export default BannerContent;
