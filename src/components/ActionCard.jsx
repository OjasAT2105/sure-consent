import { Button, Toaster, toast } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";

const ActionCard = () => {
  const { hasChanges, isSaving, saveSettings } = useSettings();

  const handleSave = async () => {
    const result = await saveSettings();
    if (result.success) {
      toast.success('Settings saved!', { description: result.message });
    } else {
      toast.error('Save failed!', { description: result.message });
    }
  };



  return (
    <>
      <Toaster position="top-right" design="stack" theme="light" autoDismiss={true} dismissAfter={5000} />
      <div className="flex justify-start gap-3 mt-6">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border disabled:border-gray-300"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
      </div>
    </>
  );
};

export default ActionCard;