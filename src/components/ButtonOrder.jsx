import { useState, useEffect } from "react";
import { Label } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";

const ButtonOrder = () => {
  const { getCurrentValue, updateSetting } = useSettings();
  const [buttonOrder, setButtonOrder] = useState([
    "decline",
    "preferences",
    "accept",
    "accept_all",
  ]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const savedOrder =
      getCurrentValue("button_order") ||
      "decline,preferences,accept,accept_all";
    setButtonOrder(savedOrder.split(","));
  }, [getCurrentValue]);

  const buttonLabels = {
    decline: "Decline",
    preferences: "Preferences",
    accept: "Accept",
    accept_all: "Accept All",
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newOrder = [...buttonOrder];
    const draggedButton = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(dropIndex, 0, draggedButton);

    setButtonOrder(newOrder);
    updateSetting("button_order", newOrder.join(","));
    setDraggedItem(null);
  };

  return (
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-3">
        Button Order
      </Label>
      <p className="text-sm text-gray-600 mb-4">
        Drag and drop to reorder buttons
      </p>
      <div className="space-y-3">
        {buttonOrder.map((button, index) => (
          <div
            key={button}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`p-3 border rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
              draggedItem === index ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M2 4h12v2H2V4zm0 6h12v2H2v-2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-800">
                {buttonLabels[button]}
              </span>
              <span className="text-sm text-gray-500 ml-auto">
                Position {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonOrder;
