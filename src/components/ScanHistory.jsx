import { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";

const ScanHistory = () => {
  const { getCurrentValue, updateSetting } = useSettings();

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Scan History
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          View history of all cookie scans performed on your website.
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6">
        <p className="text-gray-600">Scan history interface coming soon...</p>
      </div>
    </div>
  );
};

export default ScanHistory;
