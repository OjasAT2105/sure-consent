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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Customize Design
        </h1>
        <p className="text-gray-600">
          Customize the appearance and styling of your cookie banner components
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {designItems.slice(0).map((item) => (
              <div
                key={item.id}
                className={`flex flex-col justify-between p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
                  openPopup?.id === item.id
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-blue-300 bg-white"
                }`}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    {openPopup?.id === item.id && (
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Configure {item.name.toLowerCase()} settings
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  {item.id === "accept-all-btn" && (
                    <label className="flex items-center cursor-pointer space-x-2">
                      <span className="text-sm text-gray-700">Enable</span>
                      <input
                        type="checkbox"
                        checked={acceptAllEnabled}
                        onChange={(e) =>
                          updateSetting("accept_all_enabled", e.target.checked)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          acceptAllEnabled ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            acceptAllEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </label>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setOpenPopup(item)}
                    disabled={item.id === "accept-all-btn" && !acceptAllEnabled}
                    className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 text-sm font-medium px-3 py-1.5 rounded-md"
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
          <Dialog.Panel className="max-w-3xl w-full mx-auto rounded-xl shadow-xl">
            <Dialog.Body className="p-0">
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
