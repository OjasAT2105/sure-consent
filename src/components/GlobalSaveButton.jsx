import { Button, Toaster, toast } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";

const GlobalSaveButton = () => {
  const { hasChanges, isSaving, saveSettings } = useSettings();

  const handleSave = async () => {
    const result = await saveSettings();
    if (result.success) {
      toast.success('Settings saved!', { description: result.message });
    } else {
      toast.error('Save failed!', { description: result.message });
    }
  };

  if (!hasChanges) return null;

  return (
    <>
      <Toaster position="top-right" design="stack" theme="light" autoDismiss={true} dismissAfter={5000} />
      <div className="fixed top-20 right-6 z-40">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 transition-colors shadow-lg"
          size="lg"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </>
  );
};

export default GlobalSaveButton;