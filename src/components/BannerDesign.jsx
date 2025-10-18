import { useState, useEffect } from "react";
import { Label } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";

const BannerDesign = ({ activeTab }) => {
  const { getCurrentValue, updateSetting } = useSettings();
  const [bannerBgColor, setBannerBgColor] = useState("#1f2937");
  const [bgOpacity, setBgOpacity] = useState("100");
  const [textColor, setTextColor] = useState("#ffffff");
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderWidth, setBorderWidth] = useState("1");
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderRadius, setBorderRadius] = useState("8");
  const [font, setFont] = useState("Arial");
  const [bgImage, setBgImage] = useState("");
  const [acceptBtnColor, setAcceptBtnColor] = useState("#2563eb");
  const [declineBtnColor, setDeclineBtnColor] = useState("transparent");

  useEffect(() => {
    setBannerBgColor(getCurrentValue("banner_bg_color") || "#1f2937");
    setBgOpacity(getCurrentValue("bg_opacity") || "100");
    setTextColor(getCurrentValue("text_color") || "#ffffff");
    setBorderStyle(getCurrentValue("border_style") || "solid");
    setBorderWidth(getCurrentValue("border_width") || "1");
    setBorderColor(getCurrentValue("border_color") || "#000000");
    setBorderRadius(getCurrentValue("border_radius") || "8");
    setFont(getCurrentValue("font") || "Arial");
    setBgImage(getCurrentValue("bg_image") || "");
    setAcceptBtnColor(getCurrentValue("accept_btn_color") || "#2563eb");
    setDeclineBtnColor(getCurrentValue("decline_btn_color") || "transparent");
  }, []);

  const renderDesignContent = () => {
    switch(activeTab) {
      case 'design-cookie-bar':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={bannerBgColor} onChange={(e) => { setBannerBgColor(e.target.value); updateSetting("banner_bg_color", e.target.value); }} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={bannerBgColor} onChange={(e) => { setBannerBgColor(e.target.value); updateSetting("banner_bg_color", e.target.value); }} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Background Opacity (%)</Label>
              <input type="number" value={bgOpacity} onChange={(e) => { setBgOpacity(e.target.value); updateSetting("bg_opacity", e.target.value); }} min="0" max="100" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); updateSetting("text_color", e.target.value); }} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={textColor} onChange={(e) => { setTextColor(e.target.value); updateSetting("text_color", e.target.value); }} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Border Style</Label>
              <select value={borderStyle} onChange={(e) => { setBorderStyle(e.target.value); updateSetting("border_style", e.target.value); }} className="w-full px-3 py-2 border rounded">
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Border Width (px)</Label>
              <input type="number" value={borderWidth} onChange={(e) => { setBorderWidth(e.target.value); updateSetting("border_width", e.target.value); }} min="0" max="10" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Border Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={borderColor} onChange={(e) => { setBorderColor(e.target.value); updateSetting("border_color", e.target.value); }} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={borderColor} onChange={(e) => { setBorderColor(e.target.value); updateSetting("border_color", e.target.value); }} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Border Radius (px)</Label>
              <input type="number" value={borderRadius} onChange={(e) => { setBorderRadius(e.target.value); updateSetting("border_radius", e.target.value); }} min="0" max="50" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Font Family</Label>
              <select value={font} onChange={(e) => { setFont(e.target.value); updateSetting("font", e.target.value); }} className="w-full px-3 py-2 border rounded">
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Background Image</Label>
              <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if(file) { const reader = new FileReader(); reader.onload = (ev) => { setBgImage(ev.target.result); updateSetting("bg_image", ev.target.result); }; reader.readAsDataURL(file); } }} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        );
      case 'design-accept-btn':
        return (
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Accept Button Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={acceptBtnColor} onChange={(e) => { setAcceptBtnColor(e.target.value); updateSetting("accept_btn_color", e.target.value); }} className="h-10 w-20 rounded border cursor-pointer" />
                <input type="text" value={acceptBtnColor} onChange={(e) => { setAcceptBtnColor(e.target.value); updateSetting("accept_btn_color", e.target.value); }} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
          </div>
        );
      case 'design-accept-all-btn':
        return <div className="text-gray-600">Accept All Button settings coming soon...</div>;
      case 'design-decline-btn':
        return (
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Decline Button Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={declineBtnColor} onChange={(e) => { setDeclineBtnColor(e.target.value); updateSetting("decline_btn_color", e.target.value); }} className="h-10 w-20 rounded border cursor-pointer" />
                <input type="text" value={declineBtnColor} onChange={(e) => { setDeclineBtnColor(e.target.value); updateSetting("decline_btn_color", e.target.value); }} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
          </div>
        );
      case 'design-settings-btn':
        return <div className="text-gray-600">Cookie Settings Button settings coming soon...</div>;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'design-cookie-bar': return 'Cookie Bar Design';
      case 'design-accept-btn': return 'Accept Button';
      case 'design-accept-all-btn': return 'Accept All Button';
      case 'design-decline-btn': return 'Decline Button';
      case 'design-settings-btn': return 'Cookie Settings Button';
      default: return 'Design Settings';
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
      </div>
      <div className="p-6">
        {renderDesignContent()}
      </div>
    </div>
  );
};

export default BannerDesign;
