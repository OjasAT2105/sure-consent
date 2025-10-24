import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Shield,
  BarChart3,
  Target,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PreferencesModal = ({ isOpen, onClose, onSave, settings = {} }) => {
  const [preferences, setPreferences] = useState({});
  const [categories, setCategories] = useState([]);
  const [customCookies, setCustomCookies] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null); // For accordion functionality

  useEffect(() => {
    // Default categories if none are defined
    const defaultCategories = [
      {
        id: "essential",
        name: "Essential Cookies",
        description:
          "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in or filling in forms.",
        icon: "Shield",
        required: true,
      },
      {
        id: "functional",
        name: "Functional Cookies",
        description:
          "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.",
        icon: "Settings",
        required: false,
      },
      {
        id: "analytics",
        name: "Analytics Cookies",
        description:
          "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.",
        icon: "BarChart3",
        required: false,
      },
      {
        id: "marketing",
        name: "Marketing Cookies",
        description:
          "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.",
        icon: "Target",
        required: false,
      },
    ];

    // Use categories from settings if available, otherwise use defaults
    const loadedCategories =
      settings.cookie_categories && settings.cookie_categories.length > 0
        ? settings.cookie_categories
        : defaultCategories;

    setCategories(loadedCategories);

    // Load custom cookies from settings if available
    const loadedCustomCookies = settings.custom_cookies || [];
    setCustomCookies(loadedCustomCookies);

    // Initialize preferences based on categories using NAMES instead of IDs
    const initialPreferences = {};
    loadedCategories.forEach((cat) => {
      initialPreferences[cat.name] = cat.required || false;
    });

    // Load saved preferences if available
    const saved = localStorage.getItem("sureconsent_preferences");
    if (saved) {
      try {
        const savedPrefs = JSON.parse(saved);
        // Merge with initial preferences, ensuring required cookies stay enabled
        loadedCategories.forEach((cat) => {
          if (cat.required) {
            initialPreferences[cat.name] = true;
          } else if (savedPrefs[cat.name] !== undefined) {
            initialPreferences[cat.name] = savedPrefs[cat.name];
          }
        });
        setPreferences(initialPreferences);
      } catch (e) {
        console.error("Failed to parse preferences:", e);
        setPreferences(initialPreferences);
      }
    } else {
      setPreferences(initialPreferences);
    }
  }, [settings.cookie_categories, settings.custom_cookies]);

  if (!isOpen) return null;

  // Helper function to get icon component from string name
  const getIconComponent = (iconName) => {
    const icons = {
      Shield: Shield,
      Settings: Settings,
      BarChart3: BarChart3,
      Target: Target,
    };
    return icons[iconName] || Settings;
  };

  const handleToggle = (categoryName) => {
    // Find if this category is required
    const category = categories.find((cat) => cat.name === categoryName);
    if (category && category.required) return; // Cannot disable required cookies

    setPreferences((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  // Handle accordion toggle for cookie tables
  const toggleCategoryCookies = (categoryName) => {
    setExpandedCategory(
      expandedCategory === categoryName ? null : categoryName
    );
  };

  // Function to check if a cookie is expired
  const isCookieExpired = (cookie) => {
    if (!cookie.expires) return false;
    const expirationDate = new Date(cookie.expires);
    const now = new Date();
    return expirationDate < now;
  };

  const handleAcceptAll = () => {
    console.log("🟢 PreferencesModal - Accept All clicked");
    const allAccepted = {};
    categories.forEach((cat) => {
      allAccepted[cat.name] = true;
    });
    setPreferences(allAccepted);
    localStorage.setItem(
      "sureconsent_preferences",
      JSON.stringify(allAccepted)
    );

    // Log custom cookies for each category when accepting all
    logCustomCookiesForCategories(allAccepted);

    // Save consent through ConsentManager
    if (window.SureConsentManager) {
      window.SureConsentManager.saveConsent(allAccepted, "accepted");
      console.log("💾 Consent saved via ConsentManager:", allAccepted);
    }

    onSave(allAccepted);
    onClose();
  };

  const handleRejectAll = () => {
    console.log("🔴 PreferencesModal - Reject All clicked");
    const essentialOnly = {};
    categories.forEach((cat) => {
      // Only enable required cookies
      essentialOnly[cat.name] = cat.required || false;
    });
    setPreferences(essentialOnly);
    localStorage.setItem(
      "sureconsent_preferences",
      JSON.stringify(essentialOnly)
    );

    // Log custom cookies for essential categories only
    logCustomCookiesForCategories(essentialOnly);

    // Save consent through ConsentManager
    if (window.SureConsentManager) {
      window.SureConsentManager.saveConsent(essentialOnly, "decline_all");
      console.log(
        "💾 Consent saved via ConsentManager (declined):",
        essentialOnly
      );
    }

    onSave(essentialOnly);
    onClose();
  };

  const handleSavePreferences = () => {
    console.log("💾 PreferencesModal - Save Preferences clicked");
    localStorage.setItem(
      "sureconsent_preferences",
      JSON.stringify(preferences)
    );

    // Log custom cookies based on user preferences
    logCustomCookiesForCategories(preferences);

    // Save consent through ConsentManager
    if (window.SureConsentManager) {
      window.SureConsentManager.saveConsent(preferences, "partially_accepted");
      console.log(
        "💾 Consent saved via ConsentManager (partially_accepted):",
        preferences
      );
    }

    onSave(preferences);
    onClose();
  };

  // Function to log custom cookies for enabled categories
  const logCustomCookiesForCategories = (preferences) => {
    console.log("🍪 Custom Cookies by Category:");
    categories.forEach((category) => {
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

  // Get colors from settings or use defaults
  const modalBgColor = settings.banner_bg_color || "#ffffff";
  const modalTextColor = settings.text_color || "#1f2937";
  const acceptBtnColor = settings.accept_btn_color || "#2563eb";
  const acceptBtnTextColor = settings.accept_btn_text_color || "#ffffff";
  const declineBtnColor = settings.decline_btn_color || "transparent";
  const declineBtnTextColor = settings.decline_btn_text_color || "#000000";
  const declineBtnBorderColor = settings.decline_btn_border_color || "#6b7280";

  // Group custom cookies by category
  const getCookiesByCategory = (categoryName) => {
    return customCookies.filter((cookie) => cookie.category === categoryName);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="sureconsent-modal-backdrop"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="sureconsent-preferences-modal"
          style={{
            backgroundColor: modalBgColor,
            color: modalTextColor,
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            borderRadius: "12px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px",
              borderBottom: `1px solid ${modalTextColor}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "600",
                color: modalTextColor,
              }}
            >
              Privacy Preferences
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: modalTextColor,
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              padding: "20px",
              overflowY: "auto",
              flex: 1,
            }}
          >
            <p
              style={{
                marginBottom: "20px",
                fontSize: "14px",
                color: modalTextColor,
                opacity: 0.8,
              }}
            >
              We use cookies and similar technologies to help personalize
              content, tailor and measure ads, and provide a better experience.
              By clicking accept, you agree to this, as outlined in our Cookie
              Policy.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {categories.map((category) => {
                const Icon = getIconComponent(category.icon);
                const isEnabled = preferences[category.name];
                const categoryCookies = getCookiesByCategory(category.name);
                const isExpanded = expandedCategory === category.name;

                return (
                  <div
                    key={category.id}
                    style={{
                      padding: "16px",
                      border: `1px solid ${modalTextColor}15`,
                      borderRadius: "8px",
                      backgroundColor: `${modalTextColor}05`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flex: 1,
                        }}
                      >
                        <Icon size={20} style={{ color: acceptBtnColor }} />
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "600",
                            color: modalTextColor,
                            flex: 1,
                          }}
                        >
                          {category.name}
                        </h3>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggle(category.name)}
                        disabled={category.required}
                        style={{
                          width: "48px",
                          height: "24px",
                          borderRadius: "12px",
                          border: "none",
                          cursor: category.required ? "not-allowed" : "pointer",
                          backgroundColor: isEnabled
                            ? acceptBtnColor
                            : `${modalTextColor}30`,
                          position: "relative",
                          transition: "background-color 0.2s",
                          opacity: category.required ? 0.6 : 1,
                          marginRight: "8px",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "2px",
                            left: isEnabled ? "26px" : "2px",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: "#ffffff",
                            transition: "left 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isEnabled && (
                            <Check
                              size={14}
                              style={{ color: acceptBtnColor }}
                            />
                          )}
                        </span>
                      </button>

                      {/* Accordion Toggle for Cookies */}
                      {categoryCookies.length > 0 && (
                        <button
                          onClick={() => toggleCategoryCookies(category.name)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: modalTextColor,
                            opacity: 0.7,
                          }}
                        >
                          {isExpanded ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      )}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: modalTextColor,
                        opacity: 0.7,
                        lineHeight: "1.5",
                      }}
                    >
                      {category.description}
                    </p>

                    {/* Display custom cookies for this category in table format (accordion) */}
                    {categoryCookies.length > 0 && isExpanded && (
                      <div style={{ marginTop: "16px" }}>
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: modalTextColor,
                            marginBottom: "8px",
                          }}
                        >
                          Cookies in this category:
                        </h4>
                        <div
                          style={{
                            overflowX: "auto",
                            borderRadius: "4px",
                            border: `1px solid ${modalTextColor}10`,
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: "12px",
                              border: `1px solid ${modalTextColor}20`,
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  backgroundColor: `${modalTextColor}08`,
                                }}
                              >
                                <th
                                  style={{
                                    padding: "8px 12px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    borderBottom: `1px solid ${modalTextColor}20`,
                                    borderRight: `1px solid ${modalTextColor}20`,
                                  }}
                                >
                                  Name
                                </th>
                                <th
                                  style={{
                                    padding: "8px 12px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    borderBottom: `1px solid ${modalTextColor}20`,
                                    borderRight: `1px solid ${modalTextColor}20`,
                                  }}
                                >
                                  Provider
                                </th>
                                <th
                                  style={{
                                    padding: "8px 12px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    borderBottom: `1px solid ${modalTextColor}20`,
                                    borderRight: `1px solid ${modalTextColor}20`,
                                  }}
                                >
                                  Domain
                                </th>
                                <th
                                  style={{
                                    padding: "8px 12px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    borderBottom: `1px solid ${modalTextColor}20`,
                                    borderRight: `1px solid ${modalTextColor}20`,
                                  }}
                                >
                                  Duration (Days)
                                </th>
                                <th
                                  style={{
                                    padding: "8px 12px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    borderBottom: `1px solid ${modalTextColor}20`,
                                  }}
                                >
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {categoryCookies.map((cookie) => {
                                const isExpired = isCookieExpired(cookie);
                                return (
                                  <tr
                                    key={cookie.id}
                                    style={{
                                      backgroundColor: `${modalTextColor}03`,
                                    }}
                                  >
                                    <td
                                      style={{
                                        padding: "8px 12px",
                                        borderBottom: `1px solid ${modalTextColor}10`,
                                        borderRight: `1px solid ${modalTextColor}10`,
                                      }}
                                    >
                                      {cookie.name}
                                      {cookie.description && (
                                        <div
                                          style={{
                                            fontSize: "11px",
                                            opacity: 0.8,
                                            marginTop: "2px",
                                          }}
                                        >
                                          {cookie.description}
                                        </div>
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px 12px",
                                        borderBottom: `1px solid ${modalTextColor}10`,
                                        borderRight: `1px solid ${modalTextColor}10`,
                                      }}
                                    >
                                      {cookie.provider || "-"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px 12px",
                                        borderBottom: `1px solid ${modalTextColor}10`,
                                        borderRight: `1px solid ${modalTextColor}10`,
                                      }}
                                    >
                                      {cookie.domain || "-"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px 12px",
                                        borderBottom: `1px solid ${modalTextColor}10`,
                                        borderRight: `1px solid ${modalTextColor}10`,
                                      }}
                                    >
                                      {cookie.duration || "-"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px 12px",
                                        borderBottom: `1px solid ${modalTextColor}10`,
                                      }}
                                    >
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          isExpired
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {isExpired ? "Expired" : "Active"}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {category.required && (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "8px",
                          fontSize: "11px",
                          color: modalTextColor,
                          opacity: 0.6,
                          fontStyle: "italic",
                        }}
                      >
                        Always Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add padding between cookie categories and buttons */}
          <div style={{ height: "20px" }}></div>

          {/* Footer */}
          <div
            style={{
              padding: "20px",
              borderTop: `1px solid ${modalTextColor}20`,
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleRejectAll}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
                border: `1px solid ${declineBtnBorderColor}`,
                borderRadius: "6px",
                backgroundColor: declineBtnColor,
                color: declineBtnTextColor,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Reject All
            </button>

            <button
              onClick={handleSavePreferences}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
                border: `1px solid ${acceptBtnColor}`,
                borderRadius: "6px",
                backgroundColor: "transparent",
                color: acceptBtnColor,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${acceptBtnColor}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Save Preferences
            </button>

            <button
              onClick={handleAcceptAll}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                borderRadius: "6px",
                backgroundColor: acceptBtnColor,
                color: acceptBtnTextColor,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreferencesModal;
