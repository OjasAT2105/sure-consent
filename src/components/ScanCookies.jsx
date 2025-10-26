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
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCookies, setScannedCookies] = useState([]);
  const [groupedCookies, setGroupedCookies] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

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
    setIsScanning(true);

    try {
      // Client-side cookie scanning
      const clientCookies = document.cookie
        .split(";")
        .map((cookie) => {
          const [name, value] = cookie.trim().split("=");
          return {
            name: name || "",
            value: value || "",
            domain: window.location.hostname,
            path: "/",
            expires: null,
            category: "Uncategorized",
            note: "Client-side cookie",
          };
        })
        .filter((cookie) => cookie.name);

      // Get the current website URL
      const websiteUrl = window.location.origin;

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

      const data = await response.json();
      if (data.success) {
        // Refresh the cookie list
        await fetchScannedCookies();
      } else {
        console.error("Failed to save scanned cookies:", data.data?.message);
      }
    } catch (error) {
      console.error("Failed to scan cookies:", error);
    } finally {
      setIsScanning(false);
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
    switch (category.toLowerCase()) {
      case "essential":
        return "🔒";
      case "functional":
        return "⚙️";
      case "analytics":
        return "📊";
      case "marketing":
        return "📢";
      case "uncategorized":
        return "📁";
      default:
        return "🍪";
    }
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
    fetchScannedCookies();
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
                isScanning ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Play size={16} />
                )
              }
              onClick={() => scanCookies(false)}
              disabled={isScanning}
            >
              {isScanning ? "Scanning..." : "Scan Current Page"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={
                isScanning ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Play size={16} />
                )
              }
              onClick={() => scanCookies(true)}
              disabled={isScanning}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isScanning ? "Scanning..." : "Scan All Pages"}
            </Button>
          </div>
        </div>
      </div>

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
                isScanning ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Play size={16} />
                )
              }
              onClick={() => scanCookies(false)}
              disabled={isScanning}
              className="px-6"
            >
              {isScanning ? "Scanning..." : "Scan Current Page"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={
                isScanning ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Play size={16} />
                )
              }
              onClick={() => scanCookies(true)}
              disabled={isScanning}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              {isScanning ? "Scanning..." : "Scan All Pages"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanCookies;
