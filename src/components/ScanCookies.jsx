import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Button } from "@bsf/force-ui";
import { Play, Loader } from "lucide-react";

const ScanCookies = () => {
  const { getCurrentValue } = useSettings();
  const [isScanningCurrentPage, setIsScanningCurrentPage] = useState(false);
  const [isScanningAllPages, setIsScanningAllPages] = useState(false);
  const [scannedCookies, setScannedCookies] = useState([]);
  const [groupedCookies, setGroupedCookies] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  // Add state for toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Get cookie categories for mapping IDs to names
  const cookieCategories = getCurrentValue("cookie_categories") || [];

  // Helper function to get category name from ID
  const getCategoryName = (categoryId) => {
    const category = cookieCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Group cookies by category
  const groupCookiesByCategory = (cookies) => {
    const grouped = {};
    cookies.forEach((cookie) => {
      // Convert category ID to name
      const categoryId = cookie.category || "Uncategorized";
      const categoryName = getCategoryName(categoryId);
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(cookie);
    });
    return grouped;
  };

  // Fetch scanned cookies from database
  const fetchScannedCookies = async () => {
    try {
      const response = await fetch(window.sureConsentAjax.ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_get_scanned_cookies",
          nonce: window.sureConsentAjax.nonce || "",
        }),
      });

      const data = await response.json();
      if (data.success && data.data && data.data.cookies) {
        setScannedCookies(data.data.cookies);
        setGroupedCookies(groupCookiesByCategory(data.data.cookies));
      }
    } catch (error) {
      console.error("Failed to fetch scanned cookies:", error);
    }
  };

  // Function to categorize cookies based on their names using comprehensive mapping
  const categorizeCookie = (cookieName) => {
    const name = cookieName.toLowerCase();

    // 🧱 Essential Cookies
    // Used for authentication, security, session handling, or core website operation
    const essentialKeywords = [
      "session",
      "wp_session",
      "wordpress_",
      "woocommerce_",
      "cart",
      "checkout",
      "csrf",
      "token",
      "auth",
      "secure_auth",
      "phpsessid",
      "logged_in",
      "login",
      "sessid",
      "wp-settings",
      "wp-saving-post",
      "nonce",
      "xsrf",
      "laravel_session",
      "jsessionid",
      "connect.sid",
      "cookie_consent",
    ];

    if (essentialKeywords.some((keyword) => name.includes(keyword))) {
      return "Essential Cookies";
    }

    // ⚙️ Functional Cookies
    // Used for remembering user preferences, language, UI settings, or personalization
    const functionalKeywords = [
      "lang",
      "locale",
      "theme",
      "mode",
      "timezone",
      "pref_",
      "remember",
      "viewed",
      "currency",
      "settings",
      "customization",
      "user_pref",
      "accessibility",
      "font_size",
      "site_lang",
      "display",
      "consent_choice",
    ];

    if (functionalKeywords.some((keyword) => name.includes(keyword))) {
      return "Functional Cookies";
    }

    // 📊 Analytics Cookies
    // Used by tracking and analytics tools to measure site performance or user behavior
    const analyticsKeywords = [
      "_ga",
      "_gid",
      "_gat",
      "_gcl",
      "utm_",
      "analytics",
      "collect",
      "_hj",
      "hubspotutk",
      "_clck",
      "_clsk",
      "_uetsid",
      "_uetvid",
      "amplitude_id",
      "mixpanel",
      "_vwo",
      "_vis_opt",
      "_pk",
      "_snowplow",
      "matomo",
      "adobe_analytics",
      "_sf",
      "_ym",
      "yandex_metrika",
      "_fbp_analytic",
    ];

    if (analyticsKeywords.some((keyword) => name.includes(keyword))) {
      return "Analytics Cookies";
    }

    // 🎯 Marketing Cookies
    // Used for ad personalization, retargeting, social media tracking, and affiliate campaigns
    const marketingKeywords = [
      "fb_",
      "fbp",
      "fr",
      "tr",
      "pixel",
      "ads",
      "adwords",
      "gclid",
      "doubleclick",
      "affiliate",
      "trk_",
      "campaign",
      "marketing",
      "_uet",
      "_uetsid",
      "_uetvid",
      "_gcl_aw",
      "_gcl_dc",
      "linkedin_insight",
      "li_gc",
      "liap",
      "twitter_ads",
      "_tt_enable_cookie",
      "tt_sessionid",
      "outbrain",
      "taboola",
      "bing_",
      "criteo",
      "_scid",
      "sc_fb",
    ];

    if (marketingKeywords.some((keyword) => name.includes(keyword))) {
      return "Marketing Cookies";
    }

    // Default to uncategorized
    return "Uncategorized Cookies";
  };

  // Scan cookies
  const scanCookies = async (scanAllPages = false) => {
    console.log(
      "SureConsent - scanCookies called with scanAllPages:",
      scanAllPages
    );

    // Set the appropriate loading state
    if (scanAllPages) {
      setIsScanningAllPages(true);
    } else {
      setIsScanningCurrentPage(true);
    }

    try {
      // Client-side cookie scanning
      const clientCookies = document.cookie
        .split(";")
        .map((cookie) => {
          const [name, value] = cookie.trim().split("=");
          // Categorize the cookie based on its name
          const category = categorizeCookie(name);
          return {
            name: name || "",
            value: value || "",
            domain: window.location.hostname,
            path: "/",
            expires: null,
            category: category,
            note: "Client-side cookie",
          };
        })
        .filter((cookie) => cookie.name);

      console.log("SureConsent - Client cookies found:", clientCookies.length);

      // Get the current website URL
      const websiteUrl = window.location.origin;
      console.log("SureConsent - Website URL:", websiteUrl);

      // Send scanned cookies to backend
      const response = await fetch(window.sureConsentAjax.ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "sure_consent_scan_cookies",
          nonce: window.sureConsentAjax.nonce || "",
          cookies: JSON.stringify(clientCookies),
          url: websiteUrl,
          scan_all: scanAllPages ? "1" : "0",
        }),
      });

      console.log("SureConsent - Scan request sent to backend");
      const data = await response.json();
      console.log("SureConsent - Scan response received:", data);

      if (data.success) {
        console.log("SureConsent - Scan successful, refreshing cookie list");
        // Refresh the cookie list
        await fetchScannedCookies();

        // Set scan completion flag
        sessionStorage.setItem("scanCompleted", "true");

        // Show toast notification
        setToastMessage(
          `Scan Completed Successfully!\n\nFound ${
            data.data?.count || 0
          } cookies on your website. This includes custom cookies you've defined. You can now preview the cookie banner to see how it will appear to your visitors.`
        );
        setShowToast(true);

        // Hide toast after 5 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 5000);

        // Dispatch a custom event to notify other components
        window.dispatchEvent(
          new CustomEvent("scanCompleted", {
            detail: {
              cookieCount: data.data?.count || 0,
              clientCookies: data.data?.client_cookies || 0,
              serverCookies: data.data?.server_cookies || 0,
              customCookies: data.data?.custom_cookies || 0,
            },
          })
        );

        console.log("SureConsent - Scan completed successfully");
      } else {
        console.error("Failed to save scanned cookies:", data.data?.message);
      }
    } catch (error) {
      console.error("Failed to scan cookies:", error);
    } finally {
      // Reset the appropriate loading state
      if (scanAllPages) {
        setIsScanningAllPages(false);
      } else {
        setIsScanningCurrentPage(false);
      }
    }
  };

  // Toggle category expansion (allow multiple categories to be expanded)
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    // Convert to lowercase for case-insensitive comparison
    const lowerCategory = category.toLowerCase();

    // Check for exact matches first (both short and full names)
    switch (lowerCategory) {
      case "essential":
      case "essential cookies":
        return "🔒";
      case "functional":
      case "functional cookies":
        return "⚙️";
      case "analytics":
      case "analytics cookies":
        return "📊";
      case "marketing":
      case "marketing cookies":
        return "📢";
      case "uncategorized":
      case "uncategorized cookies":
        return "📁";
    }

    // Check for partial matches (more flexible)
    if (lowerCategory.includes("essential")) {
      return "🔒";
    }
    if (lowerCategory.includes("functional")) {
      return "⚙️";
    }
    if (lowerCategory.includes("analytics")) {
      return "📊";
    }
    if (lowerCategory.includes("marketing")) {
      return "📢";
    }
    if (lowerCategory.includes("uncategorized")) {
      return "📁";
    }

    // Default icon
    return "🍪";
  };

  // Format expiration date
  const formatExpiration = (expires) => {
    if (!expires) return "Session";

    try {
      const expDate = new Date(expires);
      const now = new Date();
      const diffTime = expDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return "Expired";
      } else if (diffDays === 0) {
        return "Today";
      } else if (diffDays === 1) {
        return "Tomorrow";
      } else {
        return `${diffDays} days`;
      }
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Load scanned cookies on component mount
  useEffect(() => {
    console.log("SureConsent - ScanCookies component mounted");
    fetchScannedCookies();

    // Check if auto_scan parameter is present
    const urlParams = new URLSearchParams(window.location.search);
    const autoScan = urlParams.get("auto_scan");

    console.log("SureConsent - Auto scan parameter:", autoScan);

    if (autoScan === "1") {
      console.log(
        "SureConsent - AUTO SCAN TRIGGERED - Starting scan all pages"
      );
      // Automatically start scanning all pages
      scanCookies(true);

      // Remove the auto_scan parameter from URL
      const newUrl =
        window.location.pathname +
        window.location.search.replace(/[?&]auto_scan=1/, "");
      window.history.replaceState({}, document.title, newUrl);
    } else {
      console.log("SureConsent - No auto scan parameter found");
    }
  }, []);

  return (
    <div>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 mt-4 mr-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-md animate-fade-in">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-400 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Scan Completed Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700 whitespace-pre-line">
                  {toastMessage.split("\n\n")[1]}
                </div>
              </div>
              <button
                type="button"
                className="ml-4 flex-shrink-0 text-green-500 hover:text-green-700"
                onClick={() => setShowToast(false)}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {/* Progress bar for auto-hide */}
            <div className="mt-3">
              <div className="h-1 w-full bg-green-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-progress-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Scan Cookies
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Scan your website to detect all cookies being used.
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">
              Cookie Scanner
            </h2>
            <p className="text-sm text-gray-500">
              Detect all cookies used on your website, including third-party
              cookies where possible.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={
                isScanningCurrentPage ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Play size={16} />
                )
              }
              onClick={() => scanCookies(false)}
              disabled={isScanningCurrentPage || isScanningAllPages}
            >
              {isScanningCurrentPage ? "Scanning..." : "Scan Current Page"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={
                isScanningAllPages ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Play size={16} />
                )
              }
              onClick={() => scanCookies(true)}
              disabled={isScanningCurrentPage || isScanningAllPages}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isScanningAllPages ? "Scanning..." : "Scan All Pages"}
            </Button>
          </div>
        </div>
      </div>

      {/* Scanned Cookies Accordion */}
      {Object.keys(groupedCookies).length > 0 ? (
        <div className="space-y-4 mb-6">
          {Object.entries(groupedCookies).map(([category, cookies]) => (
            <div
              key={category}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Category Header */}
              <div
                className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-150 flex justify-between items-center"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {category}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {cookies.length} cookies found
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {cookies.length} cookies
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      expandedCategories[category] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Category Cookies */}
              {expandedCategories[category] && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 cookie-details-table">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Cookie Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Value
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Domain
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Expires
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cookies.map((cookie, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {cookie.cookie_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {cookie.cookie_value || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {cookie.domain}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatExpiration(cookie.expires)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No cookies scanned yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by scanning your website for cookies.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScanCookies;
