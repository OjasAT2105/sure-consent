import React, { useState, useEffect, useCallback } from "react";
import { Settings } from "lucide-react";
import PreferencesModal from "../components/PreferencesModal";
import ConsentManager from "../utils/consentManager";

const PublicApp = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [customCSS, setCustomCSS] = useState("");
  const [messageHeading, setMessageHeading] = useState("");
  const [messageDescription, setMessageDescription] = useState(
    "We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies. You can learn more about how we use cookies in our Privacy Policy."
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

  // Geo-targeting settings
  const [geoRuleType, setGeoRuleType] = useState("worldwide");
  const [geoSelectedCountries, setGeoSelectedCountries] = useState([]);

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
  const [declineBtnTextColor, setDeclineBtnTextColor] = useState("#000000");
  const [declineBtnShowAs, setDeclineBtnShowAs] = useState("button");
  const [declineBtnBgOpacity, setDeclineBtnBgOpacity] = useState("100");
  const [declineBtnBorderStyle, setDeclineBtnBorderStyle] = useState("solid");
  const [declineBtnBorderColor, setDeclineBtnBorderColor] = useState("#6b7280");
  const [declineBtnBorderWidth, setDeclineBtnBorderWidth] = useState("1");
  const [declineBtnBorderRadius, setDeclineBtnBorderRadius] = useState("4");
  const [buttonOrder, setButtonOrder] = useState([
    "decline",
    "preferences",
    "accept",
    "accept_all",
  ]);

  // Preferences button properties
  const [preferencesBtnText, setPreferencesBtnText] = useState("Preferences");
  const [preferencesBtnTextColor, setPreferencesBtnTextColor] =
    useState("#2563eb");
  const [preferencesBtnShowAs, setPreferencesBtnShowAs] = useState("button");
  const [preferencesBtnColor, setPreferencesBtnColor] = useState("transparent");
  const [preferencesBtnBgOpacity, setPreferencesBtnBgOpacity] = useState("100");
  const [preferencesBtnBorderStyle, setPreferencesBtnBorderStyle] =
    useState("solid");
  const [preferencesBtnBorderColor, setPreferencesBtnBorderColor] =
    useState("#2563eb");
  const [preferencesBtnBorderWidth, setPreferencesBtnBorderWidth] =
    useState("1");
  const [preferencesBtnBorderRadius, setPreferencesBtnBorderRadius] =
    useState("4");
  const [cookieCategories, setCookieCategories] = useState([]);
  const [customCookies, setCustomCookies] = useState([]);

  // Completely remove CSS injection from React component
  // Handle CSS through WordPress enqueue instead

  // Fetch settings only once on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      console.log("PublicApp - Fetching frontend settings...");
      try {
        // Check if AJAX config is available
        if (!window.sureConsentAjax || !window.sureConsentAjax.ajaxurl) {
          console.error("PublicApp - AJAX configuration not available");
          return;
        }

        const response = await fetch(window.sureConsentAjax.ajaxurl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "sure_consent_get_public_settings",
            nonce: window.sureConsentAjax.nonce || "",
          }),
        });

        const data = await response.json();
        console.log("Frontend settings received:", data);
        if (data.success && data.data) {
          const heading = data.data.message_heading || "";
          const description =
            data.data.message_description ||
            "We use cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies. You can learn more about how we use cookies in our Privacy Policy.";
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

          // Geo-targeting settings
          const geoRule = data.data.geo_rule_type || "worldwide";
          const geoCountries = data.data.geo_selected_countries || [];

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
          const acceptAllBgColor =
            data.data.accept_all_btn_bg_color || "#2563eb";
          const acceptAllBgOpacity =
            data.data.accept_all_btn_bg_opacity || "100";
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
          const declineTextColor =
            data.data.decline_btn_text_color || "#000000";
          const declineShowAs = data.data.decline_btn_show_as || "button";
          const declineBgOpacity = data.data.decline_btn_bg_opacity || "100";
          const declineBorderStyle =
            data.data.decline_btn_border_style || "solid";
          const declineBorderColor =
            data.data.decline_btn_border_color || "#6b7280";
          const declineBorderWidth = data.data.decline_btn_border_width || "1";
          const declineBorderRadius =
            data.data.decline_btn_border_radius || "4";

          // Custom CSS - we'll handle this through WordPress enqueue
          const customCSSValue = data.data.custom_css || "";

          // Update state values
          setMessageHeading(heading);
          setMessageDescription(description);
          setNoticeType(type);
          setNoticePosition(position);
          setBannerEnabled(enabled);
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

          // Geo-targeting settings
          setGeoRuleType(geoRule);
          setGeoSelectedCountries(
            Array.isArray(geoCountries) ? geoCountries : []
          );

          console.log("PublicApp - Banner state:", {
            enabled,
            bannerEnabled: enabled,
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

          // Set button order - ensure preferences button is always included
          let order =
            data.data.button_order || "decline,preferences,accept,accept_all";
          const buttonOrderArray = order.split(",");

          // Ensure preferences button is always in the order
          if (!buttonOrderArray.includes("preferences")) {
            console.warn(
              "PublicApp - preferences button not found in order, adding it"
            );
            buttonOrderArray.push("preferences");
          }

          console.log("PublicApp - Final button order:", buttonOrderArray);

          setButtonOrder(buttonOrderArray);

          // Set Preferences button properties
          const preferencesText =
            data.data.preferences_btn_text || "Preferences";
          const preferencesTextColor =
            data.data.preferences_btn_text_color || "#2563eb";
          const preferencesShowAs =
            data.data.preferences_btn_show_as || "button";
          const preferencesBgColor =
            data.data.preferences_btn_color || "transparent";
          const preferencesBgOpacity =
            data.data.preferences_btn_bg_opacity || "100";
          const preferencesBorderStyle =
            data.data.preferences_btn_border_style || "solid";
          const preferencesBorderColor =
            data.data.preferences_btn_border_color || "#2563eb";
          const preferencesBorderWidth =
            data.data.preferences_btn_border_width || "1";
          const preferencesBorderRadius =
            data.data.preferences_btn_border_radius || "4";

          setPreferencesBtnText(preferencesText);
          setPreferencesBtnTextColor(preferencesTextColor);
          setPreferencesBtnShowAs(preferencesShowAs);
          setPreferencesBtnColor(preferencesBgColor);
          setPreferencesBtnBgOpacity(preferencesBgOpacity);
          setPreferencesBtnBorderStyle(preferencesBorderStyle);
          setPreferencesBtnBorderColor(preferencesBorderColor);
          setPreferencesBtnBorderWidth(preferencesBorderWidth);
          setPreferencesBtnBorderRadius(preferencesBorderRadius);

          // Set cookie categories
          const categories = data.data.cookie_categories || [];
          setCookieCategories(categories);

          // Set custom cookies
          const customCookies = data.data.custom_cookies || [];
          setCustomCookies(customCookies);
          console.log("PublicApp - Custom cookies loaded:", customCookies);

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

    fetchSettings();
  }, []);

  // Function to check if banner should be shown based on geo rules
  const shouldShowBannerBasedOnGeo = useCallback(async () => {
    // If geo rule is worldwide, always show banner
    if (geoRuleType === "worldwide") {
      return true;
    }

    // Get user's country using a geo IP service
    const getUserCountry = async () => {
      try {
        // Using ipapi.co service (free tier available)
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        return data.country_code; // Returns ISO 3166-1 alpha-2 country code (e.g., "US", "GB", "DE")
      } catch (error) {
        console.error("Failed to get user country:", error);
        // Fallback to showing banner if we can't determine the country
        return null;
      }
    };

    const userCountry = await getUserCountry();

    // If we can't determine the user's country, show the banner by default
    if (!userCountry) {
      return true;
    }

    if (geoRuleType === "eu_only") {
      // EU countries list (same as in the backend)
      const euCountries = [
        "AT",
        "BE",
        "BG",
        "HR",
        "CY",
        "CZ",
        "DK",
        "EE",
        "FI",
        "FR",
        "DE",
        "GR",
        "HU",
        "IE",
        "IT",
        "LV",
        "LT",
        "LU",
        "MT",
        "NL",
        "PL",
        "PT",
        "RO",
        "SK",
        "SI",
        "ES",
        "SE",
        "GB",
      ];
      return euCountries.includes(userCountry);
    }

    if (geoRuleType === "selected") {
      return geoSelectedCountries.includes(userCountry);
    }

    // Default to showing banner
    return true;
  }, [geoRuleType, geoSelectedCountries]);

  // Separate useEffect to check consent AFTER banner is enabled
  useEffect(() => {
    if (!bannerEnabled) return;

    console.log("PublicApp - Banner enabled, checking consent status");

    // Check geo rules
    const checkGeoRules = async () => {
      const shouldShowBasedOnGeo = await shouldShowBannerBasedOnGeo();
      if (!shouldShowBasedOnGeo) {
        console.log(
          "PublicApp - Geo rules indicate banner should not be shown"
        );
        setShowBanner(false);
        setShowSettingsButton(false);
        return;
      }

      // Check if user has already given consent
      if (window.SureConsentManager && window.SureConsentManager.hasConsent()) {
        console.log(
          "✅ PublicApp - User has consent, checking for expired cookies"
        );

        // Check if any cookies have expired
        const hasExpiredCookies = checkForExpiredCookies();
        if (hasExpiredCookies) {
          console.log("🍪 PublicApp - Expired cookies found, showing banner");
          // Show banner for re-consent
          setShowBanner(true);
          setShowSettingsButton(false);
          return;
        }

        console.log("📊 Consent data:", window.SureConsentManager.getConsent());
        // Hide banner, show floating button
        setShowBanner(false);
        setShowSettingsButton(true);
      } else {
        console.log("❌ PublicApp - No consent, showing banner");
        // Show banner, hide floating button
        setShowBanner(true);
        setShowSettingsButton(false);
      }
    };

    checkGeoRules();

    // Add event listener to check for expired cookies when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && bannerEnabled) {
        if (
          window.SureConsentManager &&
          window.SureConsentManager.hasConsent()
        ) {
          const hasExpiredCookies = checkForExpiredCookies();
          if (hasExpiredCookies) {
            console.log(
              "🍪 PublicApp - Expired cookies found (visibility change), showing banner"
            );
            setShowBanner(true);
            setShowSettingsButton(false);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [bannerEnabled, customCookies, shouldShowBannerBasedOnGeo]);

  // Add event listener for consent changes
  useEffect(() => {
    const handleConsentChange = (event) => {
      console.log("PublicApp - Consent changed event received:", event.detail);

      // Update UI based on consent change
      if (event.detail) {
        // User has given consent
        console.log("PublicApp - User gave consent, hiding banner");
        setShowBanner(false);
        setShowSettingsButton(true);
      } else {
        // Consent was cleared
        console.log("PublicApp - Consent cleared, showing banner if enabled");
        if (bannerEnabled) {
          setShowBanner(true);
          setShowSettingsButton(false);
        }
      }
    };

    // Listen for consent changes
    window.addEventListener("sureconsent_changed", handleConsentChange);

    // Cleanup event listener
    return () => {
      window.removeEventListener("sureconsent_changed", handleConsentChange);
    };
  }, [bannerEnabled]);

  // Function to check for expired cookies
  const checkForExpiredCookies = () => {
    if (!customCookies || customCookies.length === 0) return false;

    // Get user's consent data
    const consentData = window.SureConsentManager.getConsent();
    if (!consentData || !consentData.preferences) return false;

    // Check if any custom cookies have expired
    for (const cookie of customCookies) {
      if (cookie.expires) {
        const expirationDate = new Date(cookie.expires);
        const now = new Date();

        // If cookie is expired
        if (expirationDate < now) {
          // Check if this cookie's category was accepted
          const categoryAccepted = consentData.preferences[cookie.category];
          if (categoryAccepted) {
            console.log(`🍪 Expired cookie found: ${cookie.name}`);
            return true;
          }
        }
      }
    }

    return false;
  };

  // Handle accept action
  const handleAccept = async (preferences = null) => {
    console.log(
      "PublicApp - handleAccept called with preferences:",
      preferences
    );

    // Determine action type based on preferences
    let actionType = "accepted";
    if (preferences === "accept_all") {
      actionType = "accept_all";
    } else if (preferences === "decline_all") {
      actionType = "decline_all";
    }

    // If no preferences provided, use all categories as accepted
    let preferencesToSave = preferences;
    if (!preferences || typeof preferences !== "object") {
      // Create preferences object with all categories accepted
      preferencesToSave = {};
      cookieCategories.forEach((category) => {
        // Essential cookies are always accepted
        if (category.id === "essential") {
          preferencesToSave[category.id] = true;
        } else {
          // For other categories, accept by default unless it's a decline action
          preferencesToSave[category.id] = actionType !== "decline_all";
        }
      });

      // Add custom cookies to preferences
      customCookies.forEach((cookie) => {
        if (cookie.category) {
          // Only set if not already set
          if (preferencesToSave[cookie.category] === undefined) {
            preferencesToSave[cookie.category] = actionType !== "decline_all";
          }
        }
      });
    }

    // Ensure preferencesToSave is a clean object without circular references
    const cleanPreferencesToSave = {};
    if (preferencesToSave && typeof preferencesToSave === "object") {
      try {
        // Try to stringify and parse to remove circular references
        const stringified = JSON.stringify(preferencesToSave);
        Object.assign(cleanPreferencesToSave, JSON.parse(stringified));
      } catch (e) {
        // If stringify fails, manually copy properties
        Object.keys(preferencesToSave).forEach((key) => {
          const value = preferencesToSave[key];
          // Only copy primitive values
          if (
            value === null ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
          ) {
            cleanPreferencesToSave[key] = value;
          } else if (Array.isArray(value)) {
            // For arrays, create a shallow copy
            cleanPreferencesToSave[key] = [...value];
          } else if (typeof value === "object") {
            // For objects, create a shallow copy if possible
            try {
              cleanPreferencesToSave[key] = { ...value };
            } catch (e) {
              // If that fails too, skip this property
              console.warn("Skipping non-serializable property:", key);
            }
          }
        });
      }
    }

    console.log(
      "PublicApp - Final preferences to save:",
      cleanPreferencesToSave
    );

    try {
      // Save consent to backend
      const response = await fetch(window.sureConsentAjax.ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_save_consent",
          nonce: window.sureConsentAjax.nonce || "",
          preferences: JSON.stringify(cleanPreferencesToSave),
          action_type: actionType,
        }),
      });

      const data = await response.json();
      console.log("PublicApp - Consent saved:", data);

      if (data.success) {
        // Save preferences to localStorage
        localStorage.setItem(
          "sureConsentPreferences",
          JSON.stringify(cleanPreferencesToSave)
        );

        // Set cookie with expiration (1 year by default, or use setting)
        const consentDurationDays =
          window.sureConsentSettings?.consent_duration_days || 365;
        const expirationDate = new Date();
        expirationDate.setTime(
          expirationDate.getTime() + consentDurationDays * 24 * 60 * 60 * 1000
        );

        // Create cookie string
        let cookieString = `sure_consent_preferences=${encodeURIComponent(
          JSON.stringify(cleanPreferencesToSave)
        )};`;
        cookieString += `expires=${expirationDate.toUTCString()};`;
        cookieString += "path=/;";

        // Add SameSite and Secure attributes if on HTTPS
        if (window.location.protocol === "https:") {
          cookieString += "Secure;SameSite=Lax;";
        } else {
          cookieString += "SameSite=Lax;";
        }

        document.cookie = cookieString;
        console.log("PublicApp - Cookie set:", cookieString);

        // Hide the banner
        setShowBanner(false);

        // Dispatch custom event for script blocker
        window.dispatchEvent(
          new CustomEvent("sureconsentConsentGiven", {
            detail: { preferences: cleanPreferencesToSave },
          })
        );

        // Close preferences modal if open
        setShowPreferencesModal(false);

        // Reload the page to load blocked scripts
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("PublicApp - Failed to save consent:", error);
    }
  };

  const handleAcceptAll = useCallback(() => {
    console.log("🟢 User clicked ACCEPT ALL");

    // Save consent - Accept ALL categories
    const preferences = {};

    // Enable ALL cookie categories
    if (cookieCategories && cookieCategories.length > 0) {
      cookieCategories.forEach((cat) => {
        preferences[cat.name] = true; // Accept everything
      });
    } else {
      // Fallback to default categories - all true
      preferences["Essential Cookies"] = true;
      preferences["Functional Cookies"] = true;
      preferences["Analytics Cookies"] = true;
      preferences["Marketing Cookies"] = true;
    }

    // Save preferences to localStorage so PreferencesModal will show them as enabled
    localStorage.setItem(
      "sureconsent_preferences",
      JSON.stringify(preferences)
    );

    // Log custom cookies for all categories
    logCustomCookiesForCategories(preferences);

    if (window.SureConsentManager) {
      window.SureConsentManager.saveConsent(preferences, "accepted");
      console.log("💾 Consent saved (ALL accepted):", preferences);
    }

    // Hide banner, show floating button
    setShowBanner(false);
    setShowSettingsButton(true);
  }, [cookieCategories]);

  const handleDecline = useCallback(() => {
    console.log("🔴 User clicked DECLINE");

    // Save consent - Decline means only essential (can't decline essential)
    const preferences = {};
    if (cookieCategories && cookieCategories.length > 0) {
      cookieCategories.forEach((cat) => {
        preferences[cat.name] = cat.required || false;
      });
    } else {
      // Fallback to default categories
      preferences["Essential Cookies"] = true;
      preferences["Functional Cookies"] = false;
      preferences["Analytics Cookies"] = false;
      preferences["Marketing Cookies"] = false;
    }

    // Save preferences to localStorage so PreferencesModal will show the correct state
    localStorage.setItem(
      "sureconsent_preferences",
      JSON.stringify(preferences)
    );

    // Log custom cookies for essential categories only
    logCustomCookiesForCategories(preferences);

    if (window.SureConsentManager) {
      window.SureConsentManager.saveConsent(preferences, "decline_all");
      console.log("💾 Consent saved (declined):", preferences);
    }

    // Hide banner, show floating button
    setShowBanner(false);
    setShowSettingsButton(true);
  }, [cookieCategories]);

  // Dedicated handler for Preferences button click
  const handlePreferencesClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Preferences button clicked in PublicApp");
    console.log("Setting showPreferencesModal to true in PublicApp");
    setShowBanner(false);
    setShowPreferencesModal(true);
    console.log("showPreferencesModal state set to true in PublicApp");
    console.log(
      "Current state values in PublicApp - showBanner:",
      false,
      "showPreferencesModal:",
      true
    );
  }, []);

  // Function to log custom cookies for enabled categories
  const logCustomCookiesForCategories = (preferences) => {
    console.log("🍪 Custom Cookies by Category:");
    cookieCategories.forEach((category) => {
      if (preferences[category.name]) {
        const categoryCookies = customCookies.filter(
          (cookie) => cookie.category === category.name
        );
        if (categoryCookies.length > 0) {
          console.log(`📁 ${category.name}:`, categoryCookies);
        }
      }
    });
  };

  // Add effect to handle opening preferences from overlay
  useEffect(() => {
    const handleOpenPreferences = () => {
      console.log("PublicApp - Opening preferences from overlay");
      setShowPreferencesModal(true);
    };

    window.addEventListener(
      "sureconsentOpenPreferences",
      handleOpenPreferences
    );

    return () => {
      window.removeEventListener(
        "sureconsentOpenPreferences",
        handleOpenPreferences
      );
    };
  }, []);

  const handleReopenBanner = useCallback(() => {
    console.log("⚙️ User clicked floating settings button");

    // Hide floating button, show banner
    setShowSettingsButton(false);
    setShowBanner(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    console.log("PreferencesModal onClose called in PublicApp");
    console.log("Setting showPreferencesModal to false in PublicApp");
    setShowPreferencesModal(false);
    setShowSettingsButton(true);
    console.log("showPreferencesModal state set to false in PublicApp");
  }, []);

  // Handle modal save
  const handleModalSave = useCallback((preferences) => {
    console.log("Preferences saved:", preferences);

    // Don't save consent again through ConsentManager since it's already saved in the modal
    // The modal already calls saveConsent when the user clicks Save Preferences

    setShowPreferencesModal(false);
    setShowSettingsButton(true);
  }, []);

  // Always render the component, but conditionally show the banner based on bannerEnabled
  console.log("PublicApp - Rendering component:", {
    bannerEnabled,
    showBanner,
  });

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
        width: "600px",
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

  console.log("Rendering with:", {
    noticeType,
    noticePosition,
    styles: getPositionStyles(),
    showBanner,
    bannerEnabled,
  });

  return (
    <>
      {/* Banner - only show when showBanner is true AND bannerEnabled is true */}
      {bannerEnabled && showBanner && (
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
          className="sureconsent-public-banner sureconsent-banner"
          data-banner="true"
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
                  preferences:
                    (console.log("PublicApp - Creating preferences button"),
                    (
                      <button
                        key="preferences"
                        className="sureconsent-preferences-btn"
                        onClick={handlePreferencesClick}
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
                    )),
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
                      onClick={handleAcceptAll}
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
                // Filter out any undefined buttons and log for debugging
                const renderedButtons = buttonOrder
                  .map((buttonType) => {
                    const button = buttons[buttonType];
                    if (!button) {
                      console.warn(
                        `PublicApp - Button type '${buttonType}' not found`
                      );
                    } else {
                      console.log(
                        `PublicApp - Button type '${buttonType}' found and will be rendered`
                      );
                    }
                    return button;
                  })
                  .filter(Boolean);

                console.log(
                  "PublicApp - Rendering buttons:",
                  buttonOrder,
                  renderedButtons
                );
                return renderedButtons;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        settings={{
          banner_bg_color: bannerBgColor,
          text_color: textColor,
          accept_btn_color: acceptBtnColor,
          accept_btn_text_color: acceptBtnTextColor,
          decline_btn_color: declineBtnColor,
          decline_btn_text_color: declineBtnTextColor,
          decline_btn_border_color: declineBtnBorderColor,
          cookie_categories: cookieCategories,
          custom_cookies: customCookies, // Use the customCookies state
        }}
      />

      {/* Floating Cookie Settings Button */}
      {bannerEnabled && showSettingsButton && (
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
            animation: "sureconsent-slide-up 0.4s ease-out",
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

      {/* Remove the inline style tag that was causing DOM manipulation issues */}
    </>
  );
};

export default PublicApp;
