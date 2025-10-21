import { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";

const ScanCookies = () => {
  const { getCurrentValue, updateSetting } = useSettings();

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Scan Cookies
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Scan your website to detect all cookies being used.
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6">
        <p className="text-gray-600">
          Cookie scanning interface coming soon...
        </p>
      </div>
    </div>
  );
};

export default ScanCookies;
