import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import PreferencesModal from "./PreferencesModal";
import ConsentManager from "../utils/consentManager";

const PreviewBanner = () => {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const { getCurrentValue, isLoaded } = useSettings();
  const previewEnabled = getCurrentValue("preview_enabled");
  const customCSS = getCurrentValue("custom_css") || "";
  const messageHeading = getCurrentValue("message_heading") || "Cookie Notice";
  const messageDescription =
    getCurrentValue("message_description") ||
    "We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies. You can learn more about how we use cookies in our Privacy Policy.";
  const noticeType = getCurrentValue("notice_type") || "banner";
  const noticePosition = getCurrentValue("notice_position") || "bottom";
  const bannerBgColor = getCurrentValue("banner_bg_color") || "#1f2937";
  const bgOpacity = getCurrentValue("bg_opacity") || "100";
  const textColor = getCurrentValue("text_color") || "#ffffff";
  const borderStyle = getCurrentValue("border_style") || "solid";
  const borderWidth = getCurrentValue("border_width") || "1";
  const borderColor = getCurrentValue("border_color") || "#000000";
  const borderRadius = getCurrentValue("border_radius") || "8";
  const font = getCurrentValue("font") || "Arial";
  const bannerLogo = getCurrentValue("banner_logo") || "";
  const acceptBtnColor = getCurrentValue("accept_btn_color") || "#2563eb";
  const declineBtnColor = getCurrentValue("decline_btn_color") || "transparent";
  const acceptAllEnabled = getCurrentValue("accept_all_enabled") || false;

  // Accept button properties
  const acceptBtnText = getCurrentValue("accept_btn_text") || "Accept";
  const acceptBtnTextColor =
    getCurrentValue("accept_btn_text_color") || "#ffffff";
  const acceptBtnShowAs = getCurrentValue("accept_btn_show_as") || "button";
  const acceptBtnBgOpacity = getCurrentValue("accept_btn_bg_opacity") || "100";
  const acceptBtnBorderStyle =
    getCurrentValue("accept_btn_border_style") || "none";
  const acceptBtnBorderColor =
    getCurrentValue("accept_btn_border_color") || "#000000";
  const acceptBtnBorderWidth =
    getCurrentValue("accept_btn_border_width") || "1";
  const acceptBtnBorderRadius =
    getCurrentValue("accept_btn_border_radius") || "4";

  // Accept All button properties
  const acceptAllBtnText =
    getCurrentValue("accept_all_btn_text") || "Accept All";
  const acceptAllBtnTextColor =
    getCurrentValue("accept_all_btn_text_color") || "#ffffff";
  const acceptAllBtnShowAs =
    getCurrentValue("accept_all_btn_show_as") || "button";
  const acceptAllBtnBgColor =
    getCurrentValue("accept_all_btn_bg_color") || "#2563eb";
  const acceptAllBtnBgOpacity =
    getCurrentValue("accept_all_btn_bg_opacity") || "100";
  const acceptAllBtnBorderStyle =
    getCurrentValue("accept_all_btn_border_style") || "none";
  const acceptAllBtnBorderColor =
    getCurrentValue("accept_all_btn_border_color") || "#000000";
  const acceptAllBtnBorderWidth =
    getCurrentValue("accept_all_btn_border_width") || "1";
  const acceptAllBtnBorderRadius =
    getCurrentValue("accept_all_btn_border_radius") || "4";

  // Decline button properties
  const declineBtnText = getCurrentValue("decline_btn_text") || "Decline";
  const declineBtnTextColor =
    getCurrentValue("decline_btn_text_color") || "#000000";
  const declineBtnShowAs = getCurrentValue("decline_btn_show_as") || "button";
  const declineBtnBgOpacity =
    getCurrentValue("decline_btn_bg_opacity") || "100";
  const declineBtnBorderStyle =
    getCurrentValue("decline_btn_border_style") || "solid";
  const declineBtnBorderColor =
    getCurrentValue("decline_btn_border_color") || "#6b7280";
  const declineBtnBorderWidth =
    getCurrentValue("decline_btn_border_width") || "1";
  const declineBtnBorderRadius =
    getCurrentValue("decline_btn_border_radius") || "4";

  // Preferences button properties
  const preferencesBtnText =
    getCurrentValue("preferences_btn_text") || "Preferences";
  const preferencesBtnTextColor =
    getCurrentValue("preferences_btn_text_color") || "#2563eb";
  const preferencesBtnShowAs =
    getCurrentValue("preferences_btn_show_as") || "button";
  const preferencesBtnColor =
    getCurrentValue("preferences_btn_color") || "transparent";
  const preferencesBtnBgOpacity =
    getCurrentValue("preferences_btn_bg_opacity") || "100";
  const preferencesBtnBorderStyle =
    getCurrentValue("preferences_btn_border_style") || "solid";
  const preferencesBtnBorderColor =
    getCurrentValue("preferences_btn_border_color") || "#2563eb";
  const preferencesBtnBorderWidth =
    getCurrentValue("preferences_btn_border_width") || "1";
  const preferencesBtnBorderRadius =
    getCurrentValue("preferences_btn_border_radius") || "4";

  // Cookie categories
  const cookieCategories = getCurrentValue("cookie_categories") || [];

  console.log(
    "PreviewBanner - isLoaded:",
    isLoaded,
    "previewEnabled:",
    previewEnabled
  );
  console.log("the value is -> ", bannerBgColor);
  console.log("the value textColor is -> ", textColor);

  // Inject custom CSS
  useEffect(() => {
    console.log("PreviewBanner - Custom CSS:", customCSS);

    // Remove existing custom CSS if any
    const existingStyle = document.getElementById(
      "sureconsent-custom-css-preview"
    );
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new custom CSS if provided
    if (customCSS && customCSS.trim()) {
      const style = document.createElement("style");
      style.id = "sureconsent-custom-css-preview";
      // Add comment and ensure it loads with highest priority
      style.textContent = `/* SureConsent Custom CSS - Preview */\n${customCSS}`;
      document.head.appendChild(style);
      console.log("PreviewBanner - Custom CSS injected successfully!");
      console.log("PreviewBanner - CSS content:", style.textContent);
    } else {
      console.log("PreviewBanner - No custom CSS to inject");
    }

    // Cleanup on unmount
    return () => {
      const styleToRemove = document.getElementById(
        "sureconsent-custom-css-preview"
      );
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [customCSS]);

  // Don't render until settings are loaded OR if preview is explicitly disabled
  if (!isLoaded) {
    console.log("PreviewBanner - Not loaded yet");
    return null;
  }

  if (!previewEnabled) {
    console.log("PreviewBanner - Preview disabled");
    return null;
  }

  console.log("PreviewBanner - Rendering banner");

  const getPositionStyles = () => {
    // Use extremely high z-index to ensure it's above WordPress admin bar and all other elements
    const highZIndex = 999999999;

    if (noticeType === "banner") {
      return noticePosition === "top"
        ? {
            position: "fixed",
            top: "32px",
            left: 0,
            right: 0,
            zIndex: highZIndex,
            margin: 0,
            pointerEvents: "auto",
          }
        : {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: highZIndex,
            margin: 0,
            pointerEvents: "auto",
          };
    }

    if (noticeType === "box") {
      const baseStyles = {
        position: "fixed",
        zIndex: highZIndex,
        width: "600px",
        maxWidth: "90vw",
        pointerEvents: "auto",
      };
      switch (noticePosition) {
        case "top-left":
          return { ...baseStyles, top: "52px", left: "20px" };
        case "top-right":
          return { ...baseStyles, top: "52px", right: "20px" };
        case "bottom-left":
          return { ...baseStyles, bottom: "20px", left: "20px" };
        case "bottom-right":
          return { ...baseStyles, bottom: "20px", right: "20px" };
        default:
          return { ...baseStyles, bottom: "20px", right: "20px" };
      }
    }

    if (noticeType === "popup") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: highZIndex,
        width: "600px",
        maxWidth: "90vw",
        pointerEvents: "auto",
      };
    }

    return {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: highZIndex,
      margin: 0,
      pointerEvents: "auto",
    };
  };

  const hexToRgba = (hex, opacity) => {
    if (!hex || !hex.startsWith("#"))
      return `rgba(31, 41, 55, ${opacity / 100})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const getButtonStyles = (
    bgColor,
    bgOpacity,
    textColor,
    borderStyle,
    borderColor,
    borderWidth,
    borderRadius,
    showAs
  ) => {
    const baseStyles = {
      padding: "8px 16px",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s",
      color: textColor,
      borderRadius: borderRadius + "px",
      textDecoration: showAs === "link" ? "underline" : "none",
      background:
        showAs === "link" ? "transparent" : hexToRgba(bgColor, bgOpacity),
      border:
        borderStyle !== "none"
          ? `${borderWidth}px ${borderStyle} ${borderColor}`
          : "none",
    };
    return baseStyles;
  };

  const handleAccept = () => {
    setShowBanner(false);
    setShowSettingsButton(true);
  };

  const handleDecline = () => {
    setShowBanner(false);
    setShowSettingsButton(true);
  };

  const handleReopenBanner = () => {
    setShowSettingsButton(false);
    setShowBanner(true);
  };

  return (
    <>
      {/* Banner - only show when showBanner is true */}
      {showBanner && (
        <div
          style={{
            ...getPositionStyles(),
            backgroundColor: hexToRgba(bannerBgColor, bgOpacity),
            color: textColor,
            fontFamily: `"${font}", sans-serif`,
            padding: "16px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            borderRadius:
              (noticeType === "box" || noticeType === "popup"
                ? borderRadius
                : borderRadius) + "px",
            borderStyle: borderStyle !== "none" ? borderStyle : "none",
            borderWidth: borderStyle !== "none" ? borderWidth + "px" : "0px",
            borderColor: borderStyle !== "none" ? borderColor : "transparent",
            position: "fixed",
            display: "block",
            visibility: "visible",
            opacity: 1,
          }}
          className="sureconsent-preview-banner sureconsent-banner"
          data-preview="true"
        >
          <div
            style={{
              maxWidth: noticeType === "box" ? "none" : "72rem",
              margin: noticeType === "box" ? "0" : "0 auto",
              display: "flex",
              flexDirection:
                noticeType === "box" || window.innerWidth < 768
                  ? "column"
                  : "row",
              alignItems:
                noticeType === "box" || window.innerWidth < 768
                  ? "flex-start"
                  : "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              {bannerLogo && (
                <img
                  src={bannerLogo}
                  alt="Banner Logo"
                  style={{
                    height: "24px",
                    width: "auto",
                    marginBottom: "8px",
                    display: "block",
                  }}
                />
              )}
              {messageHeading && (
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    margin: "0 0 8px 0",
                    color: textColor,
                    fontFamily: `"${font}", sans-serif`,
                  }}
                >
                  {messageHeading}
                </h3>
              )}
              <p
                style={{
                  fontSize: "14px",
                  margin: 0,
                  color: textColor,
                  fontFamily: `"${font}", sans-serif`,
                }}
              >
                {messageDescription}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                width:
                  noticeType === "box" || window.innerWidth < 768
                    ? "100%"
                    : "auto",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {(() => {
                const buttonOrder = (
                  getCurrentValue("button_order") ||
                  "decline,preferences,accept,accept_all"
                ).split(",");
                const buttons = {
                  decline: (
                    <button
                      key="decline"
                      className="sureconsent-decline-btn"
                      onClick={handleDecline}
                      style={getButtonStyles(
                        declineBtnColor,
                        declineBtnBgOpacity,
                        declineBtnTextColor,
                        declineBtnBorderStyle,
                        declineBtnBorderColor,
                        declineBtnBorderWidth,
                        declineBtnBorderRadius,
                        declineBtnShowAs
                      )}
                    >
                      {declineBtnText}
                    </button>
                  ),
                  preferences: (
                    <button
                      key="preferences"
                      className="sureconsent-preferences-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowBanner(false);
                        setShowPreferencesModal(true);
                      }}
                      style={getButtonStyles(
                        preferencesBtnColor,
                        preferencesBtnBgOpacity,
                        preferencesBtnTextColor,
                        preferencesBtnBorderStyle,
                        preferencesBtnBorderColor,
                        preferencesBtnBorderWidth,
                        preferencesBtnBorderRadius,
                        preferencesBtnShowAs
                      )}
                    >
                      {preferencesBtnText}
                    </button>
                  ),
                  accept: (
                    <button
                      key="accept"
                      className="sureconsent-accept-btn"
                      onClick={handleAccept}
                      style={getButtonStyles(
                        acceptBtnColor,
                        acceptBtnBgOpacity,
                        acceptBtnTextColor,
                        acceptBtnBorderStyle,
                        acceptBtnBorderColor,
                        acceptBtnBorderWidth,
                        acceptBtnBorderRadius,
                        acceptBtnShowAs
                      )}
                    >
                      {acceptBtnText}
                    </button>
                  ),
                  accept_all: acceptAllEnabled ? (
                    <button
                      key="accept_all"
                      className="sureconsent-accept-all-btn"
                      style={getButtonStyles(
                        acceptAllBtnBgColor,
                        acceptAllBtnBgOpacity,
                        acceptAllBtnTextColor,
                        acceptAllBtnBorderStyle,
                        acceptAllBtnBorderColor,
                        acceptAllBtnBorderWidth,
                        acceptAllBtnBorderRadius,
                        acceptAllBtnShowAs
                      )}
                    >
                      {acceptAllBtnText}
                    </button>
                  ) : null,
                };
                return buttonOrder
                  .map((buttonType) => buttons[buttonType])
                  .filter(Boolean);
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => {
          setShowPreferencesModal(false);
          setShowSettingsButton(true);
        }}
        onSave={(preferences) => {
          console.log("Preferences saved:", preferences);
          setShowPreferencesModal(false);
          setShowSettingsButton(true);
        }}
        settings={{
          banner_bg_color: bannerBgColor,
          text_color: textColor,
          accept_btn_color: acceptBtnColor,
          accept_btn_text_color: acceptBtnTextColor,
          decline_btn_color: declineBtnColor,
          decline_btn_text_color: declineBtnTextColor,
          decline_btn_border_color: declineBtnBorderColor,
          cookie_categories: cookieCategories,
          custom_cookies: getCurrentValue("custom_cookies") || [], // Add custom cookies to settings
        }}
      />

      {/* Floating Cookie Settings Button */}
      {showSettingsButton && (
        <button
          onClick={handleReopenBanner}
          className="sureconsent-floating-settings"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: acceptBtnColor,
            color: acceptBtnTextColor,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 999999998,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            animation: "sureconsent-slide-up-preview 0.4s ease-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(0, 0, 0, 0.2), 0 3px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)";
          }}
          title="Cookie Settings"
        >
          <Settings size={24} />
        </button>
      )}

      {/* Add keyframe animation for slide-up effect */}
      <style>{`
        @keyframes sureconsent-slide-up-preview {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default PreviewBanner;
