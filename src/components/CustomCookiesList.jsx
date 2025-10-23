import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Button } from "@bsf/force-ui";
import { Trash2, Edit3 } from "lucide-react";

const CustomCookiesList = () => {
  const { getCurrentValue } = useSettings();

  // Get existing custom cookies
  const [customCookies, setCustomCookies] = useState([]);

  useEffect(() => {
    // Load custom cookies from settings
    const savedCookies = getCurrentValue("custom_cookies") || [];
    setCustomCookies(savedCookies);
  }, [getCurrentValue]);

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Custom Cookies List
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          View and manage all custom cookies created for your website.
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6">
        {customCookies.length > 0 ? (
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
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Provider
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customCookies.map((cookie) => (
                  <tr key={cookie.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cookie.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cookie.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cookie.provider || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cookie.duration || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {cookie.purpose || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No custom cookies have been created yet.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Create your first custom cookie using the "Create Custom Cookies"
              tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomCookiesList;
