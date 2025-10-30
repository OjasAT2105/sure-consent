/**
 * Script Blocker Module for SureConsent
 * Blocks scripts until user consent is given for the associated cookie category
 */

(function () {
  "use strict";

  // Initialize script blocker
  function initScriptBlocker() {
    // Check if SureConsent settings are available
    if (
      typeof window.sureConsentPublicSettings === "undefined" ||
      typeof window.sureConsentPublicSettings.blocked_scripts === "undefined"
    ) {
      console.log("SureConsent: No blocked scripts found");
      return;
    }

    // Get blocked scripts from settings
    const blockedScripts = window.sureConsentPublicSettings.blocked_scripts;

    if (!blockedScripts || blockedScripts.length === 0) {
      console.log("SureConsent: No blocked scripts to process");
      return;
    }

    console.log(
      "SureConsent: Initializing script blocker with",
      blockedScripts.length,
      "scripts"
    );

    // Process all blocked scripts
    blockedScripts.forEach(function (script) {
      if (script.status === "active") {
        blockScript(script);
      }
    });

    // Listen for consent changes
    if (window.SureConsent) {
      // Store original onConsentChange if it exists
      const originalOnConsentChange = window.SureConsent.onConsentChange;

      // Override onConsentChange to also handle script blocker
      window.SureConsent.onConsentChange = function (category) {
        // Call original function if it exists
        if (typeof originalOnConsentChange === "function") {
          originalOnConsentChange.call(this, category);
        }

        // Handle script blocker consent change
        handleConsentChange(category);
      };
    }
  }

  // Block a specific script
  function blockScript(script) {
    console.log(
      "SureConsent: Blocking script",
      script.script_name,
      "in category",
      script.category
    );

    // Create overlay for blocked scripts
    createScriptOverlay(script);
  }

  // Create overlay for blocked script
  function createScriptOverlay(script) {
    // Find script elements that match this blocked script
    const scriptElements = findMatchingScripts(script);

    scriptElements.forEach(function (element) {
      // Skip if already blocked
      if (element.hasAttribute("data-sureconsent-blocked")) {
        return;
      }

      // Mark as blocked
      element.setAttribute("data-sureconsent-blocked", "true");

      // Create overlay div
      const overlay = document.createElement("div");
      overlay.className = "sureconsent-overlay";
      overlay.setAttribute("data-category", script.category);
      overlay.setAttribute("data-script-id", script.id);

      // Set overlay content
      overlay.innerHTML = `
                <div class="sureconsent-overlay-content">
                    <p>This content requires consent for ${getCategoryName(
                      script.category
                    )} cookies.</p>
                    <button class="sureconsent-accept-btn" data-category="${
                      script.category
                    }">
                        Accept and Run
                    </button>
                </div>
            `;

      // Apply basic styles
      overlay.style.cssText = `
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                position: relative;
                min-height: 100px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            `;

      overlay.querySelector(".sureconsent-overlay-content").style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            `;

      const acceptBtn = overlay.querySelector(".sureconsent-accept-btn");
      acceptBtn.style.cssText = `
                background: #2563eb;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            `;

      acceptBtn.addEventListener("click", function () {
        acceptAndRunScript(script.category);
      });

      // Replace the script element with the overlay
      element.parentNode.insertBefore(overlay, element);
      element.style.display = "none";
    });

    // Find iframe elements that match this blocked script
    const iframeElements = findMatchingIframes(script);

    iframeElements.forEach(function (element) {
      // Skip if already blocked
      if (element.hasAttribute("data-sureconsent-blocked")) {
        return;
      }

      // Mark as blocked
      element.setAttribute("data-sureconsent-blocked", "true");

      // Create overlay div
      const overlay = document.createElement("div");
      overlay.className = "sureconsent-overlay";
      overlay.setAttribute("data-category", script.category);
      overlay.setAttribute("data-script-id", script.id);

      // Set overlay content
      overlay.innerHTML = `
                <div class="sureconsent-overlay-content">
                    <p>This content requires consent for ${getCategoryName(
                      script.category
                    )} cookies.</p>
                    <button class="sureconsent-accept-btn" data-category="${
                      script.category
                    }">
                        Accept and Load
                    </button>
                </div>
            `;

      // Apply basic styles
      overlay.style.cssText = `
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                position: relative;
                min-height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
            `;

      overlay.querySelector(".sureconsent-overlay-content").style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
            `;

      const acceptBtn = overlay.querySelector(".sureconsent-accept-btn");
      acceptBtn.style.cssText = `
                background: #2563eb;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            `;

      acceptBtn.addEventListener("click", function () {
        acceptAndRunScript(script.category);
      });

      // Replace the iframe element with the overlay
      element.parentNode.insertBefore(overlay, element);
      element.style.display = "none";
    });
  }

  // Find script elements that match the blocked script
  function findMatchingScripts(script) {
    const matchingElements = [];
    const scriptElements = document.querySelectorAll("script");

    scriptElements.forEach(function (element) {
      // Check if script content matches
      if (
        element.textContent &&
        script.script_code &&
        element.textContent.includes(script.script_code)
      ) {
        matchingElements.push(element);
      }

      // Check if script src matches
      if (
        element.src &&
        script.script_code &&
        script.script_code.includes(element.src)
      ) {
        matchingElements.push(element);
      }

      // Check for common third-party scripts
      if (element.src) {
        const src = element.src.toLowerCase();

        // Marketing scripts
        if (script.category === "marketing") {
          if (
            src.includes("facebook") ||
            src.includes("fbcdn") ||
            src.includes("google-analytics") ||
            src.includes("googletagmanager") ||
            src.includes("doubleclick") ||
            src.includes("adservice") ||
            src.includes("hotjar") ||
            src.includes("mixpanel") ||
            src.includes("linkedin") ||
            src.includes("twitter") ||
            src.includes("youtube") ||
            src.includes("youtu.be")
          ) {
            matchingElements.push(element);
          }
        }

        // Analytics scripts
        if (script.category === "analytics") {
          if (
            src.includes("google-analytics") ||
            src.includes("googletagmanager") ||
            src.includes("hotjar") ||
            src.includes("mixpanel") ||
            src.includes("matomo") ||
            src.includes("piwik")
          ) {
            matchingElements.push(element);
          }
        }
      }
    });

    return matchingElements;
  }

  // Find iframe elements that match the blocked script
  function findMatchingIframes(script) {
    const matchingElements = [];
    const iframeElements = document.querySelectorAll("iframe");

    // Check common third-party iframe sources
    const commonSources = {
      marketing: [
        "youtube.com",
        "youtu.be",
        "facebook.com",
        "instagram.com",
        "twitter.com",
        "tiktok.com",
        "linkedin.com",
      ],
      analytics: [
        "google-analytics.com",
        "googletagmanager.com",
        "hotjar.com",
        "mixpanel.com",
        "matomo.org",
      ],
      functional: [
        "maps.googleapis.com",
        "paypal.com",
        "stripe.com",
        "vimeo.com",
      ],
    };

    iframeElements.forEach(function (element) {
      const src = (element.src || "").toLowerCase();

      // Check if iframe src matches category sources
      if (
        commonSources[script.category] &&
        commonSources[script.category].some((source) => src.includes(source))
      ) {
        matchingElements.push(element);
      }

      // Check if script code contains iframe references
      if (
        script.script_code &&
        script.script_code.toLowerCase().includes(src)
      ) {
        matchingElements.push(element);
      }
    });

    return matchingElements;
  }

  // Get category name from ID
  function getCategoryName(categoryId) {
    // Map common category IDs to names
    const categoryNames = {
      essential: "Essential",
      functional: "Functional",
      analytics: "Analytics",
      marketing: "Marketing",
      uncategorized: "Uncategorized",
    };

    return categoryNames[categoryId] || categoryId;
  }

  // Accept and run scripts for a category
  function acceptAndRunScript(category) {
    console.log(
      "SureConsent: Accepting and running scripts for category",
      category
    );

    // Trigger consent for this category
    if (
      window.SureConsent &&
      typeof window.SureConsent.acceptCategory === "function"
    ) {
      window.SureConsent.acceptCategory(category);
    } else if (window.SureConsent) {
      // Fallback: update preferences directly
      const event = new CustomEvent("sureconsent-update-preferences", {
        detail: { category: category, accepted: true },
      });
      window.dispatchEvent(event);
    }

    // Remove overlays and run scripts
    removeOverlaysForCategory(category);
    executeScriptsForCategory(category);
  }

  // Remove overlays for a specific category
  function removeOverlaysForCategory(category) {
    const overlays = document.querySelectorAll(
      `.sureconsent-overlay[data-category="${category}"]`
    );

    overlays.forEach(function (overlay) {
      // Show the original element
      const nextElement = overlay.nextElementSibling;
      if (nextElement) {
        nextElement.style.display = "";
        nextElement.removeAttribute("data-sureconsent-blocked");
      }

      // Remove the overlay
      overlay.parentNode.removeChild(overlay);
    });
  }

  // Execute scripts for a specific category
  function executeScriptsForCategory(category) {
    if (
      typeof window.sureConsentPublicSettings === "undefined" ||
      typeof window.sureConsentPublicSettings.blocked_scripts === "undefined"
    ) {
      return;
    }

    const blockedScripts = window.sureConsentPublicSettings.blocked_scripts;

    blockedScripts.forEach(function (script) {
      if (script.category === category && script.status === "active") {
        executeScript(script);
      }
    });
  }

  // Execute a specific script
  function executeScript(script) {
    console.log("SureConsent: Executing script", script.script_name);

    try {
      // Create new script element
      const newScript = document.createElement("script");

      // Set script content
      if (script.script_code.trim().startsWith("<script")) {
        // Extract content from script tag
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = script.script_code;
        const originalScript = tempDiv.querySelector("script");

        if (originalScript) {
          // Copy attributes
          for (let i = 0; i < originalScript.attributes.length; i++) {
            const attr = originalScript.attributes[i];
            newScript.setAttribute(attr.name, attr.value);
          }

          // Set content
          newScript.textContent = originalScript.textContent;
        }
      } else {
        // Direct script content
        newScript.textContent = script.script_code;
      }

      // Add script to document
      document.body.appendChild(newScript);

      console.log(
        "SureConsent: Script executed successfully",
        script.script_name
      );
    } catch (error) {
      console.error(
        "SureConsent: Error executing script",
        script.script_name,
        error
      );
    }
  }

  // Handle consent change
  function handleConsentChange(category) {
    console.log("SureConsent: Consent changed for category", category);

    // Remove overlays and execute scripts for this category
    removeOverlaysForCategory(category);
    executeScriptsForCategory(category);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScriptBlocker);
  } else {
    initScriptBlocker();
  }

  // Expose functions to global scope if needed
  window.SureConsentScriptBlocker = {
    init: initScriptBlocker,
    acceptAndRun: acceptAndRunScript,
  };
})();
