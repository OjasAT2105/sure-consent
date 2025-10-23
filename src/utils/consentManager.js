/**
 * SureConsent - Cookie Consent Manager
 * Manages user consent preferences and controls cookie/script execution
 */

class ConsentManager {
  constructor() {
    this.CONSENT_COOKIE_NAME = "sureconsent_user_consent";
    this.CONSENT_COOKIE_EXPIRY = 365; // Days
    this.consentData = null;
    this.loadConsent();
  }

  /**
   * Load consent from cookie
   */
  loadConsent() {
    const consentCookie = this.getCookie(this.CONSENT_COOKIE_NAME);
    if (consentCookie) {
      try {
        this.consentData = JSON.parse(decodeURIComponent(consentCookie));
        console.log("SureConsent - Loaded consent:", this.consentData);
      } catch (e) {
        console.error("SureConsent - Failed to parse consent cookie:", e);
        this.consentData = null;
      }
    }
  }

  /**
   * Save consent preferences
   * @param {Object} preferences - { essential: true, functional: false, analytics: true, marketing: false }
   * @param {string} action - 'accept_all', 'decline_all', or 'custom'
   */
  saveConsent(preferences, action = "custom") {
    // Determine the actual action based on preferences
    const actualAction = this.determineAction(preferences, action);

    const consentData = {
      preferences: preferences,
      action: actualAction,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    this.consentData = consentData;

    // Save to cookie - main consent cookie ONLY
    const cookieValue = encodeURIComponent(JSON.stringify(consentData));
    this.setCookie(
      this.CONSENT_COOKIE_NAME,
      cookieValue,
      this.CONSENT_COOKIE_EXPIRY
    );

    console.log("SureConsent - Consent saved:", consentData);
    console.log("📊 Action determined as:", actualAction);
    console.log("👉 Cookie is NOW available (no refresh needed)");
    console.log("🔧 To see in DevTools: Right-click on Cookies tab → Refresh");
    console.log("🧪 Or verify by running: document.cookie");

    // Save to database via AJAX
    this.saveToDatabase(preferences, actualAction);

    // Trigger consent change event
    this.triggerConsentChange(consentData);

    // Apply consent immediately
    this.applyConsent();

    return consentData;
  }

  /**
   * Save consent to database via AJAX
   * @param {Object} preferences - User preferences
   * @param {string} action - Action type
   */
  saveToDatabase(preferences, action) {
    if (!window.sureConsentAjax) {
      console.warn("SureConsent - AJAX not available, skipping database save");
      return;
    }

    const formData = new FormData();
    formData.append("action", "sure_consent_save_consent");
    formData.append("preferences", JSON.stringify(preferences));
    formData.append("action_type", action);

    fetch(window.sureConsentAjax.ajaxurl, {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ Consent saved to database:", data.data);
        } else {
          console.error("❌ Failed to save consent to database:", data.data);
        }
      })
      .catch((error) => {
        console.error("❌ Error saving consent:", error);
      });
  }

  /**
   * Get current consent status
   * @returns {Object|null} Consent data or null if not set
   */
  getConsent() {
    return this.consentData;
  }

  /**
   * Check if user has given consent
   * @returns {boolean}
   */
  hasConsent() {
    return this.consentData !== null;
  }

  /**
   * Check if specific category is allowed
   * @param {string} category - 'essential', 'functional', 'analytics', 'marketing'
   * @returns {boolean}
   */
  isAllowed(category) {
    if (!this.consentData) {
      // No consent given yet - block everything except essential
      return category === "essential";
    }

    return this.consentData.preferences[category] === true;
  }

  /**
   * Accept all cookies
   */
  acceptAll(categories) {
    const preferences = {};
    categories.forEach((cat) => {
      preferences[cat.name] = true;
    });
    return this.saveConsent(preferences, "accept_all");
  }

  /**
   * Save custom preferences
   */
  saveCustomPreferences(preferences) {
    return this.saveConsent(preferences, "custom");
  }

  /**
   * Clear consent (for testing/reset)
   */
  clearConsent() {
    this.deleteCookie(this.CONSENT_COOKIE_NAME);
    this.consentData = null;
    console.log("SureConsent - Consent cleared");
    this.triggerConsentChange(null);
  }

  /**
   * Apply consent by blocking/unblocking scripts
   */
  applyConsent() {
    if (!this.consentData) {
      console.log("SureConsent - No consent to apply");
      return;
    }

    // Find all blocked scripts with data-consent attribute
    const scripts = document.querySelectorAll("script[data-consent]");

    scripts.forEach((script) => {
      const requiredConsent = script.getAttribute("data-consent");

      if (this.isAllowed(requiredConsent)) {
        // User has given consent - execute the script
        this.executeScript(script);
      } else {
        console.log(
          `SureConsent - Blocking script (${requiredConsent} not allowed)`
        );
      }
    });

    // Trigger event for third-party integrations
    window.dispatchEvent(
      new CustomEvent("sureconsent_applied", {
        detail: this.consentData,
      })
    );
  }

  /**
   * Execute a blocked script
   */
  executeScript(blockedScript) {
    const category = blockedScript.getAttribute("data-consent");
    console.log(`SureConsent - Executing script for category: ${category}`);

    const newScript = document.createElement("script");

    // Copy all attributes except data-consent
    Array.from(blockedScript.attributes).forEach((attr) => {
      if (attr.name !== "data-consent" && attr.name !== "type") {
        newScript.setAttribute(attr.name, attr.value);
      }
    });

    // Copy inline script content if present
    if (blockedScript.textContent) {
      newScript.textContent = blockedScript.textContent;
    }

    // Set correct type
    newScript.type = "text/javascript";

    // Replace the blocked script
    blockedScript.parentNode.replaceChild(newScript, blockedScript);
  }

  /**
   * Trigger consent change event
   */
  triggerConsentChange(consentData) {
    window.dispatchEvent(
      new CustomEvent("sureconsent_changed", {
        detail: consentData,
      })
    );
  }

  /**
   * Cookie utilities
   */
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

    // Immediately verify cookie was set
    const verification = this.getCookie(name);
    if (verification) {
      console.log(
        `✅ Cookie '${name}' set successfully (verified immediately)`
      );
      console.log(`📦 Cookie value:`, decodeURIComponent(verification));
    } else {
      console.error(`❌ Failed to set cookie '${name}'`);
    }
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  /**
   * Get consent summary for display
   */
  getConsentSummary() {
    if (!this.consentData) {
      return "No consent given";
    }

    const { action, timestamp, preferences } = this.consentData;
    const allowed = Object.keys(preferences).filter((key) => preferences[key]);

    return {
      action,
      timestamp,
      allowed,
      preferences,
    };
  }

  /**
   * Determine action type based on preferences
   * @param {Object} preferences - User's consent preferences
   * @param {string} suggestedAction - Suggested action from user interaction
   * @returns {string} - 'accept_all', 'decline_all', 'accepted', or 'partially_accepted'
   */
  determineAction(preferences, suggestedAction) {
    // If suggested action is one of the explicit actions, use it directly
    if (
      suggestedAction === "accept_all" ||
      suggestedAction === "decline_all" ||
      suggestedAction === "accepted" ||
      suggestedAction === "partially_accepted"
    ) {
      return suggestedAction;
    }

    const categoryValues = Object.values(preferences);
    const allTrue = categoryValues.every((val) => val === true);
    const allFalse = categoryValues.every((val) => val === false);
    const onlyEssential = Object.keys(preferences).every((key) =>
      key.toLowerCase().includes("essential")
        ? preferences[key] === true
        : preferences[key] === false
    );

    // All categories accepted
    if (allTrue) {
      return "accept_all";
    }

    // All declined (only essential)
    if (allFalse || onlyEssential) {
      return "decline_all";
    }

    // Some accepted, some declined = partially accepted
    return "partially_accepted";
  }
}

// Create global instance
if (typeof window !== "undefined") {
  window.SureConsentManager = new ConsentManager();

  // Apply consent on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.SureConsentManager.applyConsent();
    });
  } else {
    window.SureConsentManager.applyConsent();
  }
}

export default ConsentManager;
