import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Button } from "@bsf/force-ui";
import { Plus, Save, X, Edit3, Trash2 } from "lucide-react";
import ActionCard from "./ActionCard";

const CreateCustomCookies = () => {
  const { getCurrentValue, updateSetting } = useSettings();

  // Get existing custom cookies or initialize empty array
  const [customCookies, setCustomCookies] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state for new cookie
  const [newCookie, setNewCookie] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    provider: "",
    purpose: "",
    domain: "", // Add domain field
    type: "custom",
    expires: "", // Add expiration date field
  });

  // Get existing categories for the dropdown
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load custom cookies from settings
    const savedCookies = getCurrentValue("custom_cookies") || [];
    setCustomCookies(savedCookies);

    // Load categories for dropdown
    const savedCategories = getCurrentValue("cookie_categories") || [];
    setCategories(savedCategories);

    // Set default category if none selected
    if (
      savedCategories.length > 0 &&
      !newCookie.category &&
      savedCookies.length === 0
    ) {
      setNewCookie((prev) => ({
        ...prev,
        category: savedCategories[0].name,
      }));
    }
  }, [getCurrentValue]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    // Reset form
    setNewCookie({
      name: "",
      description: "",
      category: categories.length > 0 ? categories[0].name : "",
      duration: "",
      provider: "",
      purpose: "",
      domain: "", // Reset domain field
      expires: "", // Reset expiration field
      type: "custom",
    });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewCookie({
      name: "",
      description: "",
      category: "",
      duration: "",
      provider: "",
      purpose: "",
      domain: "", // Reset domain field
      expires: "", // Reset expiration field
      type: "custom",
    });
  };

  const handleSaveNew = () => {
    // Validation
    if (!newCookie.name.trim()) {
      alert("Please enter a cookie name");
      return;
    }

    if (!newCookie.category) {
      alert("Please select a category");
      return;
    }

    // Calculate expiration date based on duration
    const expires = calculateExpirationDate(newCookie.duration);

    const cookieToSave = {
      id: `cookie_${Date.now()}`,
      ...newCookie,
      expires, // Add calculated expiration date
    };

    const updatedCookies = [...customCookies, cookieToSave];
    setCustomCookies(updatedCookies);
    updateSetting("custom_cookies", updatedCookies);

    setIsAddingNew(false);
    setNewCookie({
      name: "",
      description: "",
      category: categories.length > 0 ? categories[0].name : "",
      duration: "",
      provider: "",
      purpose: "",
      domain: "", // Reset domain field
      expires: "", // Reset expiration field
      type: "custom",
    });
  };

  const handleEdit = (cookie) => {
    setEditingId(cookie.id);
    setIsAddingNew(true);
    setNewCookie({ ...cookie });
  };

  const handleSaveEdit = () => {
    // Validation
    if (!newCookie.name.trim()) {
      alert("Please enter a cookie name");
      return;
    }

    if (!newCookie.category) {
      alert("Please select a category");
      return;
    }

    // Calculate expiration date based on duration if it's changed
    let expires = newCookie.expires;
    if (newCookie.duration) {
      expires = calculateExpirationDate(newCookie.duration);
    }

    const updatedCookies = customCookies.map((cookie) =>
      cookie.id === editingId ? { ...newCookie, expires } : cookie
    );

    setCustomCookies(updatedCookies);
    updateSetting("custom_cookies", updatedCookies);
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleDelete = (cookieId) => {
    const updatedCookies = customCookies.filter(
      (cookie) => cookie.id !== cookieId
    );
    setCustomCookies(updatedCookies);
    updateSetting("custom_cookies", updatedCookies);
  };

  const handleInputChange = (field, value) => {
    setNewCookie((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to calculate expiration date based on duration string
  const calculateExpirationDate = (duration) => {
    if (!duration) return null;

    const now = new Date();
    const durationLower = duration.toLowerCase().trim();

    // Handle different duration formats
    if (durationLower.includes("session")) {
      // Session cookies expire when browser closes (we'll set to 1 day for demo)
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (
      durationLower.includes("minute") ||
      durationLower.includes("minutes")
    ) {
      const minutes = parseInt(durationLower);
      if (!isNaN(minutes)) {
        return new Date(now.getTime() + minutes * 60 * 1000).toISOString();
      }
    } else if (
      durationLower.includes("hour") ||
      durationLower.includes("hours")
    ) {
      const hours = parseInt(durationLower);
      if (!isNaN(hours)) {
        return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
      }
    } else if (
      durationLower.includes("day") ||
      durationLower.includes("days")
    ) {
      const days = parseInt(durationLower);
      if (!isNaN(days)) {
        return new Date(
          now.getTime() + days * 24 * 60 * 60 * 1000
        ).toISOString();
      }
    } else if (
      durationLower.includes("week") ||
      durationLower.includes("weeks")
    ) {
      const weeks = parseInt(durationLower);
      if (!isNaN(weeks)) {
        return new Date(
          now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000
        ).toISOString();
      }
    } else if (
      durationLower.includes("month") ||
      durationLower.includes("months")
    ) {
      const months = parseInt(durationLower);
      if (!isNaN(months)) {
        const newDate = new Date(now);
        newDate.setMonth(newDate.getMonth() + months);
        return newDate.toISOString();
      }
    } else if (
      durationLower.includes("year") ||
      durationLower.includes("years")
    ) {
      const years = parseInt(durationLower);
      if (!isNaN(years)) {
        const newDate = new Date(now);
        newDate.setFullYear(newDate.getFullYear() + years);
        return newDate.toISOString();
      }
    } else {
      // Try to parse as a number of days if no unit is specified
      const days = parseInt(durationLower);
      if (!isNaN(days)) {
        return new Date(
          now.getTime() + days * 24 * 60 * 60 * 1000
        ).toISOString();
      }
    }

    // Default to 30 days if format is not recognized
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  };

  // Function to check if a cookie is expired
  const isCookieExpired = (cookie) => {
    if (!cookie.expires) return false;
    const expirationDate = new Date(cookie.expires);
    const now = new Date();
    return expirationDate < now;
  };

  return (
    <div>
      <div className="mb-6">
        <h1
          className="font-semibold mb-2"
          style={{ fontSize: "20px", color: "#111827" }}
        >
          Create Custom Cookies
        </h1>
        <p className="" style={{ fontSize: "14px", color: "#4b5563" }}>
          Create and manage custom cookies for your website. These cookies will
          appear in the selected privacy preference categories.
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Add New Cookie</h2>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus />}
            onClick={handleAddNew}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add New Cookie
          </Button>
        </div>

        {/* Add/Edit Cookie Form */}
        {isAddingNew && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              {editingId ? "Edit Cookie" : "Cookie Details"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cookie Name *
                </label>
                <input
                  type="text"
                  value={newCookie.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., my_custom_cookie"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newCookie.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={newCookie.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 30 days, 1 week, 1 month"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <input
                  type="text"
                  value={newCookie.provider}
                  onChange={(e) =>
                    handleInputChange("provider", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Your Company Name"
                />
              </div>

              {/* Add domain field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  value={newCookie.domain}
                  onChange={(e) => handleInputChange("domain", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., .example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCookie.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter a description for this cookie..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <textarea
                  value={newCookie.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe the purpose of this cookie..."
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="ghost"
                size="sm"
                icon={<X />}
                onClick={handleCancelAdd}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Save />}
                onClick={editingId ? handleSaveEdit : handleSaveNew}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {editingId ? "Update Cookie" : "Save Cookie"}
              </Button>
            </div>
          </div>
        )}

        {/* Custom Cookies Table */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Custom Cookies
          </h2>

          {customCookies.length > 0 ? (
            // Increased parent container width and removed overflow-x-auto
            <div className="w-full overflow-x-auto">
              <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      >
                        Cookie Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      >
                        Provider
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      >
                        Domain
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      >
                        Duration
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customCookies.map((cookie) => {
                      const isExpired = isCookieExpired(cookie);
                      return (
                        <tr
                          key={cookie.id}
                          className="border-b border-gray-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                            <div className="text-sm font-medium text-gray-900">
                              {cookie.name}
                            </div>
                            {cookie.description && (
                              <div className="text-sm text-gray-500">
                                {cookie.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {cookie.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {cookie.provider || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {cookie.domain || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {cookie.duration || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm border-r border-gray-200">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Edit3 size={16} />}
                              onClick={() => handleEdit(cookie)}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash2 size={16} />}
                              onClick={() => handleDelete(cookie.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border border-gray-200 rounded">
              <p>No custom cookies created yet.</p>
              <p className="text-sm mt-2">
                Click "Add New Cookie" to create your first custom cookie.
              </p>
            </div>
          )}
        </div>

        {/* Action Card for saving changes */}
        <ActionCard />
      </div>

      {/* Info message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Custom cookies you create will appear in the
          selected privacy preference categories and will be visible in both the
          admin preview and frontend banner in a table format. Make sure to save
          your changes after creating or editing cookies.
        </p>
      </div>
    </div>
  );
};

export default CreateCustomCookies;
