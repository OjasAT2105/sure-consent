import { Toaster, toast } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";

const ActionCard = () => {
  const { hasChanges, isSaving, saveSettings } = useSettings();

  const handleSave = async () => {
    // Check if GeoRules validation function exists and run it
    if (typeof window.validateGeoRules === "function") {
      const isValid = window.validateGeoRules();
      if (!isValid) {
        // Validation failed, don't save
        return;
      }
    }

    const result = await saveSettings();
    if (result.success) {
      toast.success("Settings saved!", { description: result.message });
    } else {
      toast.error("Save failed!", { description: result.message });
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        design="stack"
        theme="light"
        autoDismiss={true}
        dismissAfter={5000}
      />
      <div className="flex justify-start gap-3 mt-6 mb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            !hasChanges || isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
};

export default ActionCard;
