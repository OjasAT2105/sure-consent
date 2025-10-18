import { useState } from "react";
import { Button } from "@bsf/force-ui";
import BannerDesign from "./BannerDesign";

const Design = () => {
  const [openPopup, setOpenPopup] = useState(null);

  const designItems = [
    { id: "cookie-bar", name: "Cookie Bar Design", activeTab: "design-cookie-bar" },
    { id: "accept-btn", name: "Accept Button", activeTab: "design-accept-btn" },
    { id: "accept-all-btn", name: "Accept All Button", activeTab: "design-accept-all-btn" },
    { id: "decline-btn", name: "Decline Button", activeTab: "design-decline-btn" },
    { id: "settings-btn", name: "Cookie Settings Button", activeTab: "design-settings-btn" }
  ];

  const closePopup = () => setOpenPopup(null);

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Design Settings</h2>
      </div>
      <div className="p-6 space-y-4">
        {designItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div>
              <h3 className="font-medium text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600">Configure {item.name.toLowerCase()} settings</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setOpenPopup(item)}
            >
              Configure
            </Button>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {openPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{openPopup.name} Settings</h3>
              <button 
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <BannerDesign activeTab={openPopup.activeTab} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Design;