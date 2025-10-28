import { useState, useEffect } from "react";
import { Switch, Input, Button, Textarea } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";

const ScriptBlocker = () => {
  const { getCurrentValue, updateSetting } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [scriptBlockerEnabled, setScriptBlockerEnabled] = useState(false);
  const [blockedScripts, setBlockedScripts] = useState([]);
  const [newScriptUrl, setNewScriptUrl] = useState("");
  const [newScriptDescription, setNewScriptDescription] = useState("");

  useEffect(() => {
    // Load settings
    const enabled = getCurrentValue("script_blocker_enabled") || false;
    let scripts = getCurrentValue("blocked_scripts") || [];

    // Add default script blockers if none exists
    if (scripts.length === 0) {
      scripts = [
        {
          id: Date.now() + 1,
          url: "youtube.com",
          description: "YouTube Embedded Videos",
          category: "marketing",
          enabled: true,
        },
        {
          id: Date.now() + 2,
          url: "google.com",
          description: "Google Services",
          category: "analytics",
          enabled: true,
        },
        {
          id: Date.now() + 3,
          url: "facebook.com",
          description: "Facebook SDK",
          category: "marketing",
          enabled: true,
        },
      ];
      // Save default scripts
      updateSetting("blocked_scripts", scripts);
    }

    console.log("ScriptBlocker - Loading settings:", { enabled, scripts });

    setScriptBlockerEnabled(enabled);
    setBlockedScripts(scripts);
    setIsLoading(false);
  }, [getCurrentValue, updateSetting]);

  const handleToggle = (checked) => {
    console.log("ScriptBlocker - Toggle changed:", checked);
    setScriptBlockerEnabled(checked);
    updateSetting("script_blocker_enabled", checked);
  };

  const handleAddScript = () => {
    if (newScriptUrl.trim() === "") return;

    const newScript = {
      id: Date.now(),
      url: newScriptUrl.trim(),
      description: newScriptDescription.trim() || "Custom Script",
      category: "marketing", // Default category
      enabled: true,
    };

    const updatedScripts = [...blockedScripts, newScript];
    console.log("ScriptBlocker - Adding script:", newScript);
    console.log("ScriptBlocker - Updated scripts list:", updatedScripts);

    setBlockedScripts(updatedScripts);
    updateSetting("blocked_scripts", updatedScripts);

    // Reset form
    setNewScriptUrl("");
    setNewScriptDescription("");
  };

  const handleRemoveScript = (id) => {
    const updatedScripts = blockedScripts.filter((script) => script.id !== id);
    setBlockedScripts(updatedScripts);
    updateSetting("blocked_scripts", updatedScripts);
  };

  const handleScriptToggle = (id, checked) => {
    const updatedScripts = blockedScripts.map((script) =>
      script.id === id ? { ...script, enabled: checked } : script
    );
    setBlockedScripts(updatedScripts);
    updateSetting("blocked_scripts", updatedScripts);
  };

  const handleCategoryChange = (id, category) => {
    const updatedScripts = blockedScripts.map((script) =>
      script.id === id ? { ...script, category } : script
    );
    setBlockedScripts(updatedScripts);
    updateSetting("blocked_scripts", updatedScripts);
  };

  if (isLoading) {
    return (
      <div
        className="bg-white border rounded-lg shadow-sm"
        style={{
          "--tw-border-opacity": 1,
          borderColor: "rgb(229 231 235 / var(--tw-border-opacity))",
        }}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Script Blocker
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Script Blocker
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Block third-party scripts until users give consent to protect privacy
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
          {/* Enable Script Blocker Toggle */}
          <div className="flex items-center justify-between">
            <Switch
              aria-label="Enable Script Blocker Switch"
              id="script-blocker-switch"
              label={{
                description:
                  "Block third-party scripts until users give explicit consent",
                heading: "Enable Script Blocker",
              }}
              onChange={handleToggle}
              size="sm"
              value={scriptBlockerEnabled}
            />
          </div>

          {/* Add New Script Form */}
          {scriptBlockerEnabled && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Add Script to Block
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Script URL
                  </label>
                  <Input
                    type="text"
                    placeholder="https://example.com/script.js"
                    value={newScriptUrl}
                    onChange={(val) => setNewScriptUrl(val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input
                    type="text"
                    placeholder="Description of the script"
                    value={newScriptDescription}
                    onChange={(val) => setNewScriptDescription(val)}
                  />
                </div>
              </div>
              <div className="mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddScript}
                  disabled={!newScriptUrl.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add Script
                </Button>
              </div>
            </div>
          )}

          {/* Blocked Scripts List */}
          {scriptBlockerEnabled && blockedScripts.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Blocked Scripts ({blockedScripts.length})
              </h3>
              <div className="space-y-3">
                {blockedScripts.map((script) => (
                  <div
                    key={script.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {script.description}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {script.url}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <select
                        value={script.category}
                        onChange={(e) =>
                          handleCategoryChange(script.id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="essential">Essential</option>
                        <option value="functional">Functional</option>
                        <option value="analytics">Analytics</option>
                        <option value="marketing">Marketing</option>
                      </select>
                      <Switch
                        size="sm"
                        value={script.enabled}
                        onChange={(checked) =>
                          handleScriptToggle(script.id, checked)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleRemoveScript(script.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Message */}
          {scriptBlockerEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Scripts will remain blocked until users give consent. All
                blocked scripts will be automatically loaded after consent is
                granted.
              </p>
            </div>
          )}

          <ActionCard />
        </div>
      </div>
    </div>
  );
};

export default ScriptBlocker;
