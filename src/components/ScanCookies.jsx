import React, { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Button } from "@bsf/force-ui";
import {
  Play,
  Loader,
  ChevronDown,
  ChevronRight,
  Cookie,
  FolderOpen,
  AlertCircle,
} from "lucide-react";

const ScanCookies = () => {
  const { getCurrentValue } = useSettings();
  const [isScanningCurrentPage, setIsScanningCurrentPage] = useState(false);
  const [isScanningAllPages, setIsScanningAllPages] = useState(false);
  const [scannedCookies, setScannedCookies] = useState([]);
  const [groupedCookies, setGroupedCookies] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Function to categorize cookies based on their names
  const categorizeCookie = (cookieName) => {
    const name = cookieName.toLowerCase();

    // Essential cookies (strictly necessary for website functionality)
    if (
      name.includes("session") ||
      name.includes("login") ||
      name.includes("auth") ||
      name.includes("token") ||
      name.includes("csrf") ||
      name.includes("security") ||
      name.includes("cart") ||
      name.includes("checkout") ||
      name.includes("user") ||
      name.includes("pref") ||
      name.includes("setting") ||
      name.includes("lang") ||
      name.includes("locale") ||
      name.includes("currency") ||
      name.includes("gdpr") ||
      name.includes("consent") ||
      name.includes("cookie") ||
      name.includes("sureconsent")
    ) {
      return "Essential Cookies";
    }

    // Analytics cookies
    if (
      name.includes("ga") ||
      name.includes("google") ||
      name.includes("analytics") ||
      name.includes("utm") ||
      name.includes("gtag") ||
      name.includes("gtm") ||
      name.includes("matomo") ||
      name.includes("piwik") ||
      name.includes("_ga") ||
      name.includes("_gid") ||
      name.includes("_gat")
    ) {
      return "Analytics Cookies";
    }

    // Marketing/Advertising cookies
    if (
      name.includes("ad") ||
      name.includes("ads") ||
      name.includes("advert") ||
      name.includes("facebook") ||
      name.includes("fb") ||
      name.includes("twitter") ||
      name.includes("linkedin") ||
      name.includes("instagram") ||
      name.includes("pinterest") ||
      name.includes("youtube") ||
      name.includes("tiktok") ||
      name.includes("taboola") ||
      name.includes("outbrain") ||
      name.includes("doubleclick") ||
      name.includes("taboola") ||
      name.includes("criteo") ||
      name.includes("yahoo") ||
      name.includes("bing") ||
      name.includes("gclid") ||
      name.includes("fbclid") ||
      name.includes("msclkid")
    ) {
      return "Marketing Cookies";
    }

    // Functional cookies
    if (
      name.includes("theme") ||
      name.includes("layout") ||
      name.includes("design") ||
      name.includes("custom") ||
      name.includes("personal") ||
      name.includes("preference") ||
      name.includes("config") ||
      name.includes("widget") ||
      name.includes("embed") ||
      name.includes("video") ||
      name.includes("audio") ||
      name.includes("map") ||
      name.includes("social") ||
      name.includes("share") ||
      name.includes("comment") ||
      name.includes("rating") ||
      name.includes("review")
    ) {
      return "Functional Cookies";
    }

    // Default to uncategorized
    return "Uncategorized Cookies";
  };

  // Group cookies by category
  const groupCookiesByCategory = (cookies) => {
    const grouped = {};
    cookies.forEach((cookie) => {
      const category = cookie.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(cookie);
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

  // Toggle category expansion
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

      {/* Success message after scanning */}
      {!isScanningCurrentPage &&
        !isScanningAllPages &&
        Object.keys(groupedCookies).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-400"
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
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Found {scannedCookies.length} cookies on your website. This
                    includes custom cookies you've defined. You can now preview
                    the cookie banner to see how it will appear to your
                    visitors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Scanned Cookies Accordion */}
      {Object.keys(groupedCookies).length > 0 ? (
        <div className="space-y-4">
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
                  {expandedCategories[category] ? (
                    <ChevronDown className="text-gray-500" size={20} />
                  ) : (
                    <ChevronRight className="text-gray-500" size={20} />
                  )}
                </div>
              </div>

              {/* Cookies List */}
              {expandedCategories[category] && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cookies.map((cookie) => (
                      <div
                        key={cookie.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900 text-sm break-words">
                            {cookie.cookie_name}
                          </h4>
                          <Cookie
                            size={16}
                            className="text-gray-400 flex-shrink-0 ml-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">
                              Domain
                            </span>
                            <span
                              className="text-xs text-gray-900 truncate max-w-[120px]"
                              title={cookie.domain}
                            >
                              {cookie.domain}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Path</span>
                            <span
                              className="text-xs text-gray-900 truncate max-w-[120px]"
                              title={cookie.path}
                            >
                              {cookie.path}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">
                              Expires
                            </span>
                            <span
                              className="text-xs text-gray-900"
                              title={cookie.expires}
                            >
                              {formatExpiration(cookie.expires)}
                            </span>
                          </div>

                          {cookie.note && (
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-600 italic">
                                {cookie.note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4 flex items-center justify-center">
            <FolderOpen size={48} />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No cookies scanned yet
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Start a cookie scan to detect all cookies used on your website.
            Choose between scanning the current page or all pages.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
              disabled={isScanningCurrentPage}
              className="px-6"
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              {isScanningAllPages ? "Scanning..." : "Scan All Pages"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanCookies;
