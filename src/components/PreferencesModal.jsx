import React, { useState, useEffect } from "react";
import { X, Check, Shield, BarChart3, Target, Settings } from "lucide-react";

const PreferencesModal = ({ isOpen, onClose, onSave, settings = {} }) => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Load saved preferences if available
    const saved = localStorage.getItem("sureconsent_preferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse preferences:", e);
      }
    }
  }, []);

  if (!isOpen) return null;

  const categories = [
    {
      id: "essential",
      name: "Essential Cookies",
      description:
        "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in or filling in forms.",
      icon: Shield,
      required: true,
    },
    {
      id: "functional",
      name: "Functional Cookies",
      description:
        "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.",
      icon: Settings,
      required: false,
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description:
        "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.",
      icon: BarChart3,
      required: false,
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description:
        "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.",
      icon: Target,
      required: false,
    },
  ];

  const handleToggle = (categoryId) => {
    if (categoryId === "essential") return; // Cannot disable essential
    setPreferences((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem(
      "sureconsent_preferences",
      JSON.stringify(allAccepted)
    );
    onSave(allAccepted);
    onClose();
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem(
      "sureconsent_preferences",
      JSON.stringify(essentialOnly)
    );
    onSave(essentialOnly);
    onClose();
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "sureconsent_preferences",
      JSON.stringify(preferences)
    );
    onSave(preferences);
    onClose();
  };

  // Get colors from settings or use defaults
  const modalBgColor = settings.banner_bg_color || "#ffffff";
  const modalTextColor = settings.text_color || "#1f2937";
  const acceptBtnColor = settings.accept_btn_color || "#2563eb";
  const acceptBtnTextColor = settings.accept_btn_text_color || "#ffffff";
  const declineBtnColor = settings.decline_btn_color || "transparent";
  const declineBtnTextColor = settings.decline_btn_text_color || "#000000";
  const declineBtnBorderColor = settings.decline_btn_border_color || "#6b7280";

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
                const Icon = category.icon;
                const isEnabled = preferences[category.id];

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
                        }}
                      >
                        <Icon size={20} style={{ color: acceptBtnColor }} />
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "600",
                            color: modalTextColor,
                          }}
                        >
                          {category.name}
                        </h3>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggle(category.id)}
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
