import { Button, Toaster, toast } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";

const ActionCard = () => {
  const { hasChanges, isSaving, saveSettings, getCurrentValue, updateSetting } = useSettings();
  const previewEnabled = getCurrentValue('preview_enabled');

  const handleSave = async () => {
    const result = await saveSettings();
    if (result.success) {
      toast.success('Settings saved!', { description: result.message });
    } else {
      toast.error('Save failed!', { description: result.message });
    }
  };

  const togglePreview = () => {
    updateSetting('preview_enabled', !previewEnabled);
  };

  return (
    <>
      <Toaster position="top-right" design="stack" theme="light" autoDismiss={true} dismissAfter={5000} />
      <div className="bg-white border rounded-lg shadow-sm mb-6" style={{'--tw-border-opacity': 1, borderColor: 'rgb(229 231 235 / var(--tw-border-opacity))'}}>
        <div className="p-4 flex justify-end gap-3">
          <Button
            onClick={togglePreview}
            className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600 transition-colors"
          >
            {previewEnabled ? 'Hide Preview' : 'Show Preview'}
          </Button>
          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ActionCard;