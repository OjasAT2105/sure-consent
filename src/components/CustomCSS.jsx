import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";

const CustomCSS = () => {
  const { getCurrentValue, updateSetting, isLoaded, settings, saveSettings } =
    useSettings();
  const [customCSS, setCustomCSS] = useState("");

  useEffect(() => {
    if (isLoaded) {
      const savedCSS = getCurrentValue("custom_css") || "";
      console.log("CustomCSS - Loading saved CSS:", savedCSS);
      setCustomCSS(savedCSS);
    }
  }, [isLoaded, settings]);

  const handleCSSChange = (code) => {
    console.log("CustomCSS - CSS changed:", code);
    setCustomCSS(code);
    updateSetting("custom_css", code);
  };

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset custom CSS? This will remove all your custom styles."
      )
    ) {
      return;
    }
    console.log("CustomCSS - Resetting to default");
    setCustomCSS("");
    updateSetting("custom_css", "");
    // Save immediately
    await saveSettings();
    alert("Custom CSS has been reset. The banner will now use default styles.");
  };

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Custom CSS
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Add custom CSS to style your cookie banner. Changes will be reflected
          in both preview and frontend after saving.
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              CSS Code Editor
            </label>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 focus:outline-none focus:ring-0"
            >
              Reset to Default
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Write your custom CSS below.{" "}
            <strong className="text-red-600">
              IMPORTANT: You MUST use !important
            </strong>{" "}
            to override inline styles.
            <br />
            You can target banner elements using classes like{" "}
            <code className="bg-gray-700 text-gray-200 px-1 rounded">
              .sureconsent-banner
            </code>
            ,{" "}
            <code className="bg-gray-700 text-gray-200 px-1 rounded">
              .sureconsent-accept-btn
            </code>
            , etc.
          </p>
          <div className="border border-gray-600 rounded-md overflow-hidden bg-gray-900">
            <Editor
              value={customCSS}
              onValueChange={handleCSSChange}
              highlight={(code) => highlight(code, languages.css, "css")}
              padding={12}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
                minHeight: "400px",
              }}
              placeholder="/* Enter your custom CSS here */&#10;.sureconsent-banner {&#10;  color: red !important;&#10;  /* Use !important to override inline styles */&#10;}"
              className="focus:outline-none"
              textareaClassName="focus:outline-none"
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              💡 Quick Tips:
            </h3>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>
                Use{" "}
                <code className="bg-blue-100 px-1 rounded">
                  .sureconsent-banner
                </code>{" "}
                to target the cookie banner (works in both preview and frontend)
              </li>
              <li>
                Use{" "}
                <code className="bg-blue-100 px-1 rounded">
                  .sureconsent-accept-btn
                </code>
                ,{" "}
                <code className="bg-blue-100 px-1 rounded">
                  .sureconsent-decline-btn
                </code>{" "}
                for buttons
              </li>
              <li>
                <strong>Important:</strong> Use{" "}
                <code className="bg-blue-100 px-1 rounded">!important</code> to
                override inline styles (e.g.,{" "}
                <code className="bg-blue-100 px-1 rounded">
                  color: red !important;
                </code>
                )
              </li>
              <li>Changes take effect after clicking "Save Changes" below</li>
              <li>Your CSS is saved and will persist after page refresh</li>
            </ul>
          </div>
        </div>
      </div>

      <ActionCard />
    </div>
  );
};

export default CustomCSS;
