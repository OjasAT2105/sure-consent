import React, { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Button } from "@bsf/force-ui";
import { Play, Loader, ChevronDown, ChevronUp } from "lucide-react";

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
  const scanCookies = async () => {
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
          <Button
            variant="primary"
            size="sm"
            icon={isScanning ? <Loader className="animate-spin" /> : <Play />}
            onClick={scanCookies}
            disabled={isScanning}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isScanning ? "Scanning..." : "Start Scan"}
          </Button>
        </div>
      </div>

      {/* Scanned Cookies Accordion */}
      {Object.keys(groupedCookies).length > 0 ? (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          {Object.entries(groupedCookies).map(([category, cookies]) => (
            <div key={category} className="border-b last:border-b-0">
              <div
                className="bg-gray-50 px-6 py-4 border-b cursor-pointer flex justify-between items-center"
                onClick={() => toggleCategory(category)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {cookies.length} cookies
                  </p>
                </div>
                <div>
                  {expandedCategories[category] ? (
                    <ChevronUp className="text-gray-500" />
                  ) : (
                    <ChevronDown className="text-gray-500" />
                  )}
                </div>
              </div>
              {expandedCategories[category] && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
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
                          Path
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Expiration
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cookies.map((cookie) => (
                        <tr key={cookie.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {cookie.cookie_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {cookie.cookie_value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cookie.domain}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cookie.path}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cookie.expires
                              ? new Date(cookie.expires).toLocaleDateString()
                              : "Session"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {cookie.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-lg shadow-sm p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No cookies scanned yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start a cookie scan to detect all cookies used on your website.
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={isScanning ? <Loader className="animate-spin" /> : <Play />}
            onClick={scanCookies}
            disabled={isScanning}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isScanning ? "Scanning..." : "Start Scan"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScanCookies;
