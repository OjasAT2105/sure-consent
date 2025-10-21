import React, { useState, useEffect } from "react";

const PublicApp = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [messageHeading, setMessageHeading] = useState("");
  const [messageDescription, setMessageDescription] = useState(
    "This website uses cookies to improve your experience. We'll assume you're ok with this, but you can opt-out if you wish."
  );
  const [noticeType, setNoticeType] = useState("banner");
  const [noticePosition, setNoticePosition] = useState("bottom");
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
  const [acceptAllEnabled, setAcceptAllEnabled] = useState(false);

  // Accept button properties
  const [acceptBtnText, setAcceptBtnText] = useState("Accept");
  const [acceptBtnTextColor, setAcceptBtnTextColor] = useState("#ffffff");
  const [acceptBtnShowAs, setAcceptBtnShowAs] = useState("button");
  const [acceptBtnBgOpacity, setAcceptBtnBgOpacity] = useState("100");
  const [acceptBtnBorderStyle, setAcceptBtnBorderStyle] = useState("none");
  const [acceptBtnBorderColor, setAcceptBtnBorderColor] = useState("#000000");
  const [acceptBtnBorderWidth, setAcceptBtnBorderWidth] = useState("1");
  const [acceptBtnBorderRadius, setAcceptBtnBorderRadius] = useState("4");

  // Accept All button properties
  const [acceptAllBtnText, setAcceptAllBtnText] = useState("Accept All");
  const [acceptAllBtnTextColor, setAcceptAllBtnTextColor] = useState("#ffffff");
  const [acceptAllBtnShowAs, setAcceptAllBtnShowAs] = useState("button");
  const [acceptAllBtnBgColor, setAcceptAllBtnBgColor] = useState("#2563eb");
  const [acceptAllBtnBgOpacity, setAcceptAllBtnBgOpacity] = useState("100");
  const [acceptAllBtnBorderStyle, setAcceptAllBtnBorderStyle] =
    useState("none");
  const [acceptAllBtnBorderColor, setAcceptAllBtnBorderColor] =
    useState("#000000");
  const [acceptAllBtnBorderWidth, setAcceptAllBtnBorderWidth] = useState("1");
  const [acceptAllBtnBorderRadius, setAcceptAllBtnBorderRadius] = useState("4");

  // Decline button properties
  const [declineBtnText, setDeclineBtnText] = useState("Decline");
  const [declineBtnTextColor, setDeclineBtnTextColor] = useState("#ffffff");
  const [declineBtnShowAs, setDeclineBtnShowAs] = useState("button");
  const [declineBtnBgOpacity, setDeclineBtnBgOpacity] = useState("100");
  const [declineBtnBorderStyle, setDeclineBtnBorderStyle] = useState("solid");
  const [declineBtnBorderColor, setDeclineBtnBorderColor] = useState("#6b7280");
  const [declineBtnBorderWidth, setDeclineBtnBorderWidth] = useState("1");
  const [declineBtnBorderRadius, setDeclineBtnBorderRadius] = useState("4");
  const [buttonOrder, setButtonOrder] = useState([
    "decline",
    "accept",
    "accept_all",
  ]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    console.log("PublicApp - Fetching frontend settings...");
    try {
      const response = await fetch("/wp-admin/admin-ajax.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_get_public_settings",
        }),
      });

      const data = await response.json();
      console.log("Frontend settings received:", data);
      if (data.success && data.data) {
        const heading = data.data.message_heading || "";
        const description =
          data.data.message_description ||
          "This website uses cookies to improve your experience. We'll assume you're ok with this, but you can opt-out if you wish.";
        const type = data.data.notice_type || "banner";
        const position = data.data.notice_position || "bottom";
        const enabled = data.data.banner_enabled || false;
        const bgColor = data.data.banner_bg_color || "#1f2937";
        const opacity = data.data.bg_opacity || "100";
        const txtColor = data.data.text_color || "#ffffff";
        const bStyle = data.data.border_style || "solid";
        const bWidth = data.data.border_width || "1";
        const bColor = data.data.border_color || "#000000";
        const bRadius = data.data.border_radius || "8";
        const fontFamily = data.data.font || "Arial";
        const logo = data.data.banner_logo || "";
        const acceptColor = data.data.accept_btn_color || "#2563eb";
        const declineColor = data.data.decline_btn_color || "transparent";
        const acceptAllEnabledValue = data.data.accept_all_enabled || false;

        // Accept button properties
        const acceptText = data.data.accept_btn_text || "Accept";
        const acceptTextColor = data.data.accept_btn_text_color || "#ffffff";
        const acceptShowAs = data.data.accept_btn_show_as || "button";
        const acceptBgOpacity = data.data.accept_btn_bg_opacity || "100";
        const acceptBorderStyle = data.data.accept_btn_border_style || "none";
        const acceptBorderColor =
          data.data.accept_btn_border_color || "#000000";
        const acceptBorderWidth = data.data.accept_btn_border_width || "1";
        const acceptBorderRadius = data.data.accept_btn_border_radius || "4";

        // Accept All button properties
        const acceptAllText = data.data.accept_all_btn_text || "Accept All";
        const acceptAllTextColor =
          data.data.accept_all_btn_text_color || "#ffffff";
        const acceptAllShowAs = data.data.accept_all_btn_show_as || "button";
        const acceptAllBgColor = data.data.accept_all_btn_bg_color || "#2563eb";
        const acceptAllBgOpacity = data.data.accept_all_btn_bg_opacity || "100";
        const acceptAllBorderStyle =
          data.data.accept_all_btn_border_style || "none";
        const acceptAllBorderColor =
          data.data.accept_all_btn_border_color || "#000000";
        const acceptAllBorderWidth =
          data.data.accept_all_btn_border_width || "1";
        const acceptAllBorderRadius =
          data.data.accept_all_btn_border_radius || "4";

        // Decline button properties
        const declineText = data.data.decline_btn_text || "Decline";
        const declineTextColor = data.data.decline_btn_text_color || "#ffffff";
        const declineShowAs = data.data.decline_btn_show_as || "button";
        const declineBgOpacity = data.data.decline_btn_bg_opacity || "100";
        const declineBorderStyle =
          data.data.decline_btn_border_style || "solid";
        const declineBorderColor =
          data.data.decline_btn_border_color || "#6b7280";
        const declineBorderWidth = data.data.decline_btn_border_width || "1";
        const declineBorderRadius = data.data.decline_btn_border_radius || "4";

        setMessageHeading(heading);
        setMessageDescription(description);
        setNoticeType(type);
        setNoticePosition(position);
        setBannerEnabled(enabled);
        setShowBanner(enabled);
        setBannerBgColor(bgColor);
        setBgOpacity(opacity);
        setTextColor(txtColor);
        setBorderStyle(bStyle);
        setBorderWidth(bWidth);
        setBorderColor(bColor);
        setBorderRadius(bRadius);
        setFont(fontFamily);
        setBannerLogo(logo);
        setAcceptBtnColor(acceptColor);
        setDeclineBtnColor(declineColor);
        setAcceptAllEnabled(acceptAllEnabledValue);

        console.log("PublicApp - Banner state:", {
          enabled,
          bannerEnabled: enabled,
          showBanner: enabled,
        });

        // Set Accept button properties
        setAcceptBtnText(acceptText);
        setAcceptBtnTextColor(acceptTextColor);
        setAcceptBtnShowAs(acceptShowAs);
        setAcceptBtnBgOpacity(acceptBgOpacity);
        setAcceptBtnBorderStyle(acceptBorderStyle);
        setAcceptBtnBorderColor(acceptBorderColor);
        setAcceptBtnBorderWidth(acceptBorderWidth);
        setAcceptBtnBorderRadius(acceptBorderRadius);

        // Set Accept All button properties
        setAcceptAllBtnText(acceptAllText);
        setAcceptAllBtnTextColor(acceptAllTextColor);
        setAcceptAllBtnShowAs(acceptAllShowAs);
        setAcceptAllBtnBgColor(acceptAllBgColor);
        setAcceptAllBtnBgOpacity(acceptAllBgOpacity);
        setAcceptAllBtnBorderStyle(acceptAllBorderStyle);
        setAcceptAllBtnBorderColor(acceptAllBorderColor);
        setAcceptAllBtnBorderWidth(acceptAllBorderWidth);
        setAcceptAllBtnBorderRadius(acceptAllBorderRadius);

        // Set Decline button properties
        setDeclineBtnText(declineText);
        setDeclineBtnTextColor(declineTextColor);
        setDeclineBtnShowAs(declineShowAs);
        setDeclineBtnBgOpacity(declineBgOpacity);
        setDeclineBtnBorderStyle(declineBorderStyle);
        setDeclineBtnBorderColor(declineBorderColor);
        setDeclineBtnBorderWidth(declineBorderWidth);
        setDeclineBtnBorderRadius(declineBorderRadius);

        // Set button order
        const order = data.data.button_order || "decline,accept,accept_all";
        setButtonOrder(order.split(","));

        console.log("Frontend state set:", {
          noticeType: type,
          noticePosition: position,
          enabled,
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleAccept = () => {
    setShowBanner(false);
    // Add cookie consent logic here
  };

  const handleDecline = () => {
    setShowBanner(false);
    // Add cookie decline logic here
  };

  if (!showBanner || !bannerEnabled) {
    console.log("PublicApp - Banner not showing:", {
      showBanner,
      bannerEnabled,
    });
    return null;
  }

  console.log("PublicApp - Rendering banner!");

  const getPositionStyles = () => {
    const highZIndex = 999999999; // Very high z-index to ensure visibility

    if (noticeType === "banner") {
      return noticePosition === "top"
        ? {
            position: "fixed",
            top: 0,
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
        width: "280px",
        maxWidth: "90vw",
        pointerEvents: "auto",
      };
      switch (noticePosition) {
        case "top-left":
          return { ...baseStyles, top: "20px", left: "20px" };
        case "top-right":
          return { ...baseStyles, top: "20px", right: "20px" };
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
        width: "400px",
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
    return {
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
  };

  console.log("Rendering with:", {
    noticeType,
    noticePosition,
    styles: getPositionStyles(),
    showBanner,
    bannerEnabled,
  });

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
      className="sureconsent-public-banner"
      data-banner="true"
    >
      <div
        style={{
          maxWidth:
            noticeType === "box" || noticeType === "popup" ? "none" : "72rem",
          margin:
            noticeType === "box" || noticeType === "popup" ? "0" : "0 auto",
          display: "flex",
          flexDirection:
            noticeType === "box" ||
            noticeType === "popup" ||
            window.innerWidth < 768
              ? "column"
              : "row",
          alignItems:
            noticeType === "box" ||
            noticeType === "popup" ||
            window.innerWidth < 768
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
              noticeType === "box" ||
              noticeType === "popup" ||
              window.innerWidth < 768
                ? "100%"
                : "auto",
          }}
        >
          {buttonOrder
            .map((buttonType) => {
              switch (buttonType) {
                case "decline":
                  return (
                    <button
                      key="decline"
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
                  );
                case "accept":
                  return (
                    <button
                      key="accept"
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
                  );
                case "accept_all":
                  return acceptAllEnabled ? (
                    <button
                      key="accept_all"
                      onClick={handleAccept}
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
                  ) : null;
                default:
                  return null;
              }
            })
            .filter(Boolean)}
        </div>
      </div>
    </div>
  );
};

export default PublicApp;
