import { useState } from "react";
import { Switch } from "@bsf/force-ui";

const PreviewCard = () => {
  const [previewEnabled, setPreviewEnabled] = useState(false);

  return (
    <div
      className="bg-white border rounded-lg shadow-sm mb-4"
      style={{
        "--tw-border-opacity": 1,
        borderColor: "rgb(229 231 235 / var(--tw-border-opacity))",
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Cookie Consent Banner
            </h3>
            <p className="text-sm text-gray-600">
              Configure and customize your cookie consent banner to comply with
              privacy regulations and improve user experience on your website.
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Preview Banner</span>
              <Switch
                checked={previewEnabled}
                onChange={setPreviewEnabled}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
