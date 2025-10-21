import { useState, useEffect } from "react";
import { Select } from "@bsf/force-ui";
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

  const handleLawChange = (value) => {
    setSelectedLaw(value);
    updateSetting("compliance_law", value);

    // Set CCPA defaults when CCPA is selected
    if (value.name === "CCPA") {
      updateSetting("message_heading", "");
      // Removed the default CCPA message
      updateSetting("message_description", "");
    }
  };

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
          Select the privacy law that applies to your website
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
          <div className="flex items-center justify-between border rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance Law
              </label>
              <Select onChange={handleLawChange} size="sm" value={selectedLaw}>
                <Select.Button>
                  {selectedLaw?.name || "Select compliance law"}
                </Select.Button>
                <Select.Options>
                  <Select.Option value={{ id: "1", name: "GDPR" }}>
                    GDPR
                  </Select.Option>
                  <Select.Option value={{ id: "2", name: "CCPA" }}>
                    CCPA
                  </Select.Option>
                </Select.Options>
              </Select>
              <p className="mt-3 text-sm text-gray-600">
                {selectedLaw?.name === "GDPR"
                  ? "The chosen law template supports various global privacy regulations including GDPR (EU & UK), PIPEDA (Canada), Law 25 (Quebec), POPIA (South Africa), nFADP (Switzerland), Privacy Act (Australia), PDPL (Saudi Arabia), PDPL (Argentina), PDPL (Andorra), and DPA (Faroe Islands)."
                  : "The chosen law template supports CCPA/CPRA (California), VCDPA (Virginia), CPA (Colorado), CTDPA (Connecticut), & UCPA (Utah)."}
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
