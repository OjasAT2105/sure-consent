import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";

const Laws = () => {
  const { getCurrentValue, updateSetting } = useSettings();
  const [selectedLaw, setSelectedLaw] = useState({ id: "1", name: "GDPR" });

  useEffect(() => {
    const currentLaw = getCurrentValue("compliance_law");
    if (currentLaw) {
      setSelectedLaw(currentLaw);
    }
  }, [getCurrentValue]);

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Laws
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Privacy law compliance for your website
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
          <div className="flex items-center justify-between border rounded-lg p-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance Law
              </label>
              <div className="text-lg font-semibold text-gray-900 mb-3">
                GDPR (Default)
              </div>
              <p className="text-sm text-gray-600">
                This plugin supports various global privacy regulations
                including GDPR (EU & UK), PIPEDA (Canada), Law 25 (Quebec),
                POPIA (South Africa), nFADP (Switzerland), Privacy Act
                (Australia), PDPL (Saudi Arabia), PDPL (Argentina), PDPL
                (Andorra), and DPA (Faroe Islands).
              </p>
            </div>
          </div>
          <ActionCard />
        </div>
      </div>
    </div>
  );
};

export default Laws;
