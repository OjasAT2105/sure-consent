import { useState } from "react";
import { Button, Dialog } from "@bsf/force-ui";
import BannerDesign from "./BannerDesign";
import { useSettings } from "../contexts/SettingsContext";
import ActionCard from "./ActionCard";

const Design = () => {
  const [openPopup, setOpenPopup] = useState(null);
  const { getCurrentValue, updateSetting } = useSettings();
  const acceptAllEnabled = getCurrentValue("accept_all_enabled") || false;

  const designItems = [
    {
      id: "cookie-bar",
      name: "Cookie Bar Design",
      activeTab: "design-cookie-bar",
    },
    { id: "accept-btn", name: "Accept Button", activeTab: "design-accept-btn" },
    {
      id: "accept-all-btn",
      name: "Accept All Button",
      activeTab: "design-accept-all-btn",
    },
    {
      id: "decline-btn",
      name: "Decline Button",
      activeTab: "design-decline-btn",
    },
    {
      id: "preferences-btn",
      name: "Preferences Button",
      activeTab: "design-preferences-btn",
    },
    {
      id: "settings-btn",
      name: "Cookie Settings Button",
      activeTab: "design-settings-btn",
    },
  ];

  const closePopup = () => setOpenPopup(null);

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Design Settings
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Customize the appearance and styling of your cookie banner
        </p>
      </div>
      <div className="bg-white border rounded-lg shadow-sm mb-6">
        <div className="p-4">
          {/* First item - Full width (Cookie Bar Design) */}
          <div className="mb-4 pb-4 border-b-2 border-gray-200">
            <div className="flex items-center justify-between p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-800">
                  {designItems[0].name}
                </h3>
                <p className="text-sm text-gray-600">
                  Configure {designItems[0].name.toLowerCase()} settings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenPopup(designItems[0])}
                >
                  Configure
                </Button>
              </div>
            </div>
          </div>

          {/* Remaining items - 2 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {designItems.slice(1).map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 bg-gray-50"
              >
                <div className="mb-3">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Configure {item.name.toLowerCase()} settings
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  {item.id === "accept-all-btn" && (
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptAllEnabled}
                        onChange={(e) =>
                          updateSetting("accept_all_enabled", e.target.checked)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          acceptAllEnabled ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            acceptAllEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </label>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenPopup(item)}
                    disabled={item.id === "accept-all-btn" && !acceptAllEnabled}
                    className="ml-auto"
                  >
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <ActionCard />
        </div>
      </div>

      {/* Dialog Modals */}
      {designItems.map((item) => (
        <Dialog
          key={item.id}
          design="simple"
          exitOnEsc
          scrollLock
          setOpen={(isOpen) => !isOpen && setOpenPopup(null)}
          trigger={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenPopup(item)}
              style={{ display: "none" }}
            >
              Configure
            </Button>
          }
          open={openPopup?.id === item.id}
        >
          <Dialog.Backdrop onClick={closePopup} />
          <Dialog.Panel className="max-w-2xl w-full mx-auto rounded-none">
            <Dialog.Body className="p-4">
              <BannerDesign
                activeTab={item.activeTab}
                closePopup={closePopup}
              />
            </Dialog.Body>
          </Dialog.Panel>
        </Dialog>
      ))}
    </div>
  );
};

export default Design;
