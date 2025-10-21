import { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useEffect } from "react";

const PreviewBanner = () => {
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

  return (
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
            noticeType === "box" || window.innerWidth < 768 ? "column" : "row",
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
              noticeType === "box" || window.innerWidth < 768 ? "100%" : "auto",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {(() => {
            const buttonOrder = (
              getCurrentValue("button_order") || "decline,accept,accept_all"
            ).split(",");
            const buttons = {
              decline: (
                <button
                  key="decline"
                  className="sureconsent-decline-btn"
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
              accept: (
                <button
                  key="accept"
                  className="sureconsent-accept-btn"
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
  );
};

export default PreviewBanner;
