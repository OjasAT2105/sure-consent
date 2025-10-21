import { useState, useEffect } from "react";
import { Label, Select, Button } from "@bsf/force-ui";
import { useSettings } from "../contexts/SettingsContext";

const BannerDesign = ({ activeTab, closePopup }) => {
  const { getCurrentValue, updateSetting } = useSettings();
  
  const getDefaultValues = (buttonType) => {
    const defaults = {
      'cookie-bar': {
        banner_bg_color: '#1f2937',
        bg_opacity: '100',
        text_color: '#ffffff',
        border_style: 'solid',
        border_width: '1',
        border_color: '#000000',
        border_radius: '8',
        font: 'Arial',
        banner_logo: ''
      },
      'accept-btn': {
        accept_btn_text: 'Accept',
        accept_btn_text_color: '#ffffff',
        accept_btn_show_as: 'button',
        accept_btn_color: '#2563eb',
        accept_btn_bg_opacity: '100',
        accept_btn_border_style: 'none',
        accept_btn_border_color: '#000000',
        accept_btn_border_width: '1',
        accept_btn_border_radius: '4'
      },
      'accept-all-btn': {
        accept_all_btn_text: 'Accept All',
        accept_all_btn_text_color: '#ffffff',
        accept_all_btn_show_as: 'button',
        accept_all_btn_bg_color: '#2563eb',
        accept_all_btn_bg_opacity: '100',
        accept_all_btn_border_style: 'none',
        accept_all_btn_border_color: '#000000',
        accept_all_btn_border_width: '1',
        accept_all_btn_border_radius: '4'
      },
      'decline-btn': {
        decline_btn_text: 'Decline',
        decline_btn_text_color: '#ffffff',
        decline_btn_show_as: 'button',
        decline_btn_color: 'transparent',
        decline_btn_bg_opacity: '100',
        decline_btn_border_style: 'solid',
        decline_btn_border_color: '#6b7280',
        decline_btn_border_width: '1',
        decline_btn_border_radius: '4'
      },
      'settings-btn': {
        settings_btn_text: 'Cookie Settings',
        settings_btn_text_color: '#ffffff',
        settings_btn_bg_color: '#6b7280',
        settings_btn_bg_opacity: '100',
        settings_btn_border_style: 'none',
        settings_btn_border_color: '#000000',
        settings_btn_border_width: '1',
        settings_btn_border_radius: '4'
      }
    };
    return defaults[buttonType] || {};
  };
  
  const resetToDefaults = () => {
    if (!confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      return;
    }
    const buttonType = activeTab.replace('design-', '');
    const defaults = getDefaultValues(buttonType);
    Object.entries(defaults).forEach(([key, value]) => {
      updateSetting(key, value);
    });
    // Update local state for cookie bar
    if (buttonType === 'cookie-bar') {
      setBannerBgColor(defaults.banner_bg_color);
      setBgOpacity(defaults.bg_opacity);
      setTextColor(defaults.text_color);
      setBorderStyle(defaults.border_style);
      setBorderWidth(defaults.border_width);
      setBorderColor(defaults.border_color);
      setBorderRadius(defaults.border_radius);
      setFont(defaults.font);
      setBannerLogo(defaults.banner_logo);
    } else if (buttonType === 'accept-btn') {
      setAcceptBtnColor(defaults.accept_btn_color);
    } else if (buttonType === 'decline-btn') {
      setDeclineBtnColor(defaults.decline_btn_color);
    }
  };
  const [bannerBgColor, setBannerBgColor] = useState("#1f2937");
  const [bgOpacity, setBgOpacity] = useState("100");
  const [textColor, setTextColor] = useState("#ffffff");
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderWidth, setBorderWidth] = useState("1");
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderRadius, setBorderRadius] = useState("8");
  const [font, setFont] = useState("Arial");
  const [bannerLogo, setBannerLogo] = useState("");
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
    setBannerLogo(getCurrentValue("banner_logo") || "");
    setAcceptBtnColor(getCurrentValue("accept_btn_color") || "#2563eb");
    setDeclineBtnColor(getCurrentValue("decline_btn_color") || "transparent");
  }, []);

  const renderDesignContent = () => {
    switch(activeTab) {
      case 'design-cookie-bar':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Background Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={bannerBgColor} onChange={(e) => { setBannerBgColor(e.target.value); updateSetting("banner_bg_color", e.target.value); }} className="h-10 w-16 rounded-md border border-gray-300 cursor-pointer" />
                <input type="text" value={bannerBgColor} onChange={(e) => { setBannerBgColor(e.target.value); updateSetting("banner_bg_color", e.target.value); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Background Opacity (%)</Label>
              <input type="number" value={bgOpacity} onChange={(e) => { setBgOpacity(e.target.value); updateSetting("bg_opacity", e.target.value); }} min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Text Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); updateSetting("text_color", e.target.value); }} className="h-10 w-16 rounded-md border border-gray-300 cursor-pointer" />
                <input type="text" value={textColor} onChange={(e) => { setTextColor(e.target.value); updateSetting("text_color", e.target.value); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">Border Style</Label>
              <select value={borderStyle} onChange={(e) => { setBorderStyle(e.target.value); updateSetting("border_style", e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
              <Label className="block text-sm font-medium text-gray-700 mb-2">Banner Logo</Label>
              <div className="space-y-3">
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if(file) { const reader = new FileReader(); reader.onload = (ev) => { setBannerLogo(ev.target.result); updateSetting("banner_logo", ev.target.result); }; reader.readAsDataURL(file); } }} className="w-full px-3 py-2 border rounded" />
                {bannerLogo && (
                  <div className="flex items-center gap-3">
                    <img src={bannerLogo} alt="Banner Logo" className="h-12 w-auto border rounded" />
                    <button type="button" onClick={() => { setBannerLogo(""); updateSetting("banner_logo", ""); }} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete Logo</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'design-accept-btn':
        const acceptShowAs = getCurrentValue("accept_btn_show_as") || "button";
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Button Text</Label>
              <input type="text" value={getCurrentValue("accept_btn_text") || "Accept"} onChange={(e) => updateSetting("accept_btn_text", e.target.value)} maxLength="20" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={getCurrentValue("accept_btn_text_color") || "#ffffff"} onChange={(e) => updateSetting("accept_btn_text_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={getCurrentValue("accept_btn_text_color") || "#ffffff"} onChange={(e) => updateSetting("accept_btn_text_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Show As</Label>
              <select value={acceptShowAs} onChange={(e) => updateSetting("accept_btn_show_as", e.target.value)} className="w-full px-3 py-2 border rounded">
                <option value="button">Button</option>
                <option value="link">Link</option>
              </select>
            </div>
            {acceptShowAs === "button" && (
              <>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={acceptBtnColor} onChange={(e) => { setAcceptBtnColor(e.target.value); updateSetting("accept_btn_color", e.target.value); }} className="h-10 w-16 rounded border cursor-pointer" />
                    <input type="text" value={acceptBtnColor} onChange={(e) => { setAcceptBtnColor(e.target.value); updateSetting("accept_btn_color", e.target.value); }} className="flex-1 px-3 py-2 border rounded" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Background Opacity (%)</Label>
                  <input type="number" value={getCurrentValue("accept_btn_bg_opacity") || "100"} onChange={(e) => updateSetting("accept_btn_bg_opacity", e.target.value)} min="0" max="100" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Style</Label>
                  <select value={getCurrentValue("accept_btn_border_style") || "none"} onChange={(e) => updateSetting("accept_btn_border_style", e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={getCurrentValue("accept_btn_border_color") || "#000000"} onChange={(e) => updateSetting("accept_btn_border_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                    <input type="text" value={getCurrentValue("accept_btn_border_color") || "#000000"} onChange={(e) => updateSetting("accept_btn_border_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Width (px)</Label>
                  <input type="number" value={getCurrentValue("accept_btn_border_width") || "1"} onChange={(e) => updateSetting("accept_btn_border_width", e.target.value)} min="0" max="10" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Radius (px)</Label>
                  <input type="number" value={getCurrentValue("accept_btn_border_radius") || "4"} onChange={(e) => updateSetting("accept_btn_border_radius", e.target.value)} min="0" max="50" className="w-full px-3 py-2 border rounded" />
                </div>
              </>
            )}
          </div>
        );
      case 'design-accept-all-btn':
        const acceptAllShowAs = getCurrentValue("accept_all_btn_show_as") || "button";
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Button Text</Label>
              <input type="text" value={getCurrentValue("accept_all_btn_text") || "Accept All"} onChange={(e) => updateSetting("accept_all_btn_text", e.target.value)} maxLength="20" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={getCurrentValue("accept_all_btn_text_color") || "#ffffff"} onChange={(e) => updateSetting("accept_all_btn_text_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={getCurrentValue("accept_all_btn_text_color") || "#ffffff"} onChange={(e) => updateSetting("accept_all_btn_text_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Show As</Label>
              <select value={acceptAllShowAs} onChange={(e) => updateSetting("accept_all_btn_show_as", e.target.value)} className="w-full px-3 py-2 border rounded">
                <option value="button">Button</option>
                <option value="link">Link</option>
              </select>
            </div>
            {acceptAllShowAs === "button" && (
              <>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={getCurrentValue("accept_all_btn_bg_color") || "#2563eb"} onChange={(e) => updateSetting("accept_all_btn_bg_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                    <input type="text" value={getCurrentValue("accept_all_btn_bg_color") || "#2563eb"} onChange={(e) => updateSetting("accept_all_btn_bg_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Background Opacity (%)</Label>
                  <input type="number" value={getCurrentValue("accept_all_btn_bg_opacity") || "100"} onChange={(e) => updateSetting("accept_all_btn_bg_opacity", e.target.value)} min="0" max="100" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Style</Label>
                  <select value={getCurrentValue("accept_all_btn_border_style") || "none"} onChange={(e) => updateSetting("accept_all_btn_border_style", e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={getCurrentValue("accept_all_btn_border_color") || "#000000"} onChange={(e) => updateSetting("accept_all_btn_border_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                    <input type="text" value={getCurrentValue("accept_all_btn_border_color") || "#000000"} onChange={(e) => updateSetting("accept_all_btn_border_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Width (px)</Label>
                  <input type="number" value={getCurrentValue("accept_all_btn_border_width") || "1"} onChange={(e) => updateSetting("accept_all_btn_border_width", e.target.value)} min="0" max="10" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Radius (px)</Label>
                  <input type="number" value={getCurrentValue("accept_all_btn_border_radius") || "4"} onChange={(e) => updateSetting("accept_all_btn_border_radius", e.target.value)} min="0" max="50" className="w-full px-3 py-2 border rounded" />
                </div>
              </>
            )}
          </div>
        );
      case 'design-decline-btn':
        const declineShowAs = getCurrentValue("decline_btn_show_as") || "button";
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Button Text</Label>
              <input type="text" value={getCurrentValue("decline_btn_text") || "Decline"} onChange={(e) => updateSetting("decline_btn_text", e.target.value)} maxLength="20" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={getCurrentValue("decline_btn_text_color") || "#ffffff"} onChange={(e) => updateSetting("decline_btn_text_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={getCurrentValue("decline_btn_text_color") || "#ffffff"} onChange={(e) => updateSetting("decline_btn_text_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Show As</Label>
              <select value={declineShowAs} onChange={(e) => updateSetting("decline_btn_show_as", e.target.value)} className="w-full px-3 py-2 border rounded">
                <option value="button">Button</option>
                <option value="link">Link</option>
              </select>
            </div>
            {declineShowAs === "button" && (
              <>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={declineBtnColor} onChange={(e) => { setDeclineBtnColor(e.target.value); updateSetting("decline_btn_color", e.target.value); }} className="h-10 w-16 rounded border cursor-pointer" />
                    <input type="text" value={declineBtnColor} onChange={(e) => { setDeclineBtnColor(e.target.value); updateSetting("decline_btn_color", e.target.value); }} className="flex-1 px-3 py-2 border rounded" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Background Opacity (%)</Label>
                  <input type="number" value={getCurrentValue("decline_btn_bg_opacity") || "100"} onChange={(e) => updateSetting("decline_btn_bg_opacity", e.target.value)} min="0" max="100" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Style</Label>
                  <select value={getCurrentValue("decline_btn_border_style") || "solid"} onChange={(e) => updateSetting("decline_btn_border_style", e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={getCurrentValue("decline_btn_border_color") || "#6b7280"} onChange={(e) => updateSetting("decline_btn_border_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                    <input type="text" value={getCurrentValue("decline_btn_border_color") || "#6b7280"} onChange={(e) => updateSetting("decline_btn_border_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Width (px)</Label>
                  <input type="number" value={getCurrentValue("decline_btn_border_width") || "1"} onChange={(e) => updateSetting("decline_btn_border_width", e.target.value)} min="0" max="10" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Border Radius (px)</Label>
                  <input type="number" value={getCurrentValue("decline_btn_border_radius") || "4"} onChange={(e) => updateSetting("decline_btn_border_radius", e.target.value)} min="0" max="50" className="w-full px-3 py-2 border rounded" />
                </div>
              </>
            )}
          </div>
        );
      case 'design-settings-btn':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Button Text</Label>
              <input type="text" value={getCurrentValue("settings_btn_text") || "Cookie Settings"} onChange={(e) => updateSetting("settings_btn_text", e.target.value)} maxLength="20" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Text Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={getCurrentValue("settings_btn_text_color") || "#ffffff"} onChange={(e) => updateSetting("settings_btn_text_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={getCurrentValue("settings_btn_text_color") || "#ffffff"} onChange={(e) => updateSetting("settings_btn_text_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={getCurrentValue("settings_btn_bg_color") || "#6b7280"} onChange={(e) => updateSetting("settings_btn_bg_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={getCurrentValue("settings_btn_bg_color") || "#6b7280"} onChange={(e) => updateSetting("settings_btn_bg_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Background Opacity (%)</Label>
              <input type="number" value={getCurrentValue("settings_btn_bg_opacity") || "100"} onChange={(e) => updateSetting("settings_btn_bg_opacity", e.target.value)} min="0" max="100" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Border Style</Label>
              <select value={getCurrentValue("settings_btn_border_style") || "none"} onChange={(e) => updateSetting("settings_btn_border_style", e.target.value)} className="w-full px-3 py-2 border rounded">
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Border Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={getCurrentValue("settings_btn_border_color") || "#000000"} onChange={(e) => updateSetting("settings_btn_border_color", e.target.value)} className="h-10 w-16 rounded border cursor-pointer" />
                <input type="text" value={getCurrentValue("settings_btn_border_color") || "#000000"} onChange={(e) => updateSetting("settings_btn_border_color", e.target.value)} className="flex-1 px-3 py-2 border rounded" />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Border Width (px)</Label>
              <input type="number" value={getCurrentValue("settings_btn_border_width") || "1"} onChange={(e) => updateSetting("settings_btn_border_width", e.target.value)} min="0" max="10" className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Border Radius (px)</Label>
              <input type="number" value={getCurrentValue("settings_btn_border_radius") || "4"} onChange={(e) => updateSetting("settings_btn_border_radius", e.target.value)} min="0" max="50" className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        );
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
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={resetToDefaults} className="text-red-600 border-red-600 hover:bg-red-50">
            Reset to Default
          </Button>
          {closePopup && (
            <button
              onClick={closePopup}
              className="p-1 cursor-pointer border-none bg-none"
              style={{border: 'none', background: 'none'}}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="p-3">
        {renderDesignContent()}
      </div>
    </div>
  );
};

export default BannerDesign;