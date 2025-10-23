import { useState, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Button } from "@bsf/force-ui";
import { Plus, Save, X } from "lucide-react";

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
    type: "custom",
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
    if (savedCategories.length > 0 && !newCookie.category) {
      setNewCookie((prev) => ({
        ...prev,
        category: savedCategories[0].name,
      }));
    }
  }, [getCurrentValue]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    // Reset form
    setNewCookie({
      name: "",
      description: "",
      category: categories.length > 0 ? categories[0].name : "",
      duration: "",
      provider: "",
      purpose: "",
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

    const cookieToSave = {
      id: `cookie_${Date.now()}`,
      ...newCookie,
    };

    const updatedCookies = [...customCookies, cookieToSave];
    setCustomCookies(updatedCookies);
    updateSetting("custom_cookies", updatedCookies);

    // Also update the category to include this cookie
    updateCategoryWithCookie(newCookie.category, cookieToSave);

    setIsAddingNew(false);
    setNewCookie({
      name: "",
      description: "",
      category: categories.length > 0 ? categories[0].name : "",
      duration: "",
      provider: "",
      purpose: "",
      type: "custom",
    });

    // Redirect to the custom cookies list page
    window.location.hash = "#/cookie-manager/list";
  };

  const updateCategoryWithCookie = (categoryName, cookie) => {
    // This function would update the category to include reference to this cookie
    // For now, we'll just ensure the cookie has the category assigned
    console.log(`Cookie ${cookie.name} assigned to category ${categoryName}`);
  };

  const handleEdit = (cookie) => {
    setEditingId(cookie.id);
    setNewCookie({ ...cookie });
  };

  const handleSaveEdit = () => {
    const updatedCookies = customCookies.map((cookie) =>
      cookie.id === editingId ? { ...newCookie } : cookie
    );

    setCustomCookies(updatedCookies);
    updateSetting("custom_cookies", updatedCookies);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
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
          <h2 className="text-lg font-medium text-gray-900">Custom Cookies</h2>
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

        {/* Add New Cookie Form */}
        {isAddingNew && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Add New Cookie
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
                  placeholder="e.g., 30 days, Session"
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
                onClick={handleSaveNew}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save Cookie
              </Button>
            </div>
          </div>
        )}

        {/* Custom Cookies List */}
        {customCookies.length > 0 ? (
          <div className="space-y-4">
            {customCookies.map((cookie) => (
              <div
                key={cookie.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                {editingId === cookie.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cookie Name *
                        </label>
                        <input
                          type="text"
                          value={newCookie.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Purpose
                        </label>
                        <textarea
                          value={newCookie.purpose}
                          onChange={(e) =>
                            handleInputChange("purpose", e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<X />}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Save />}
                        onClick={handleSaveEdit}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-md font-medium text-gray-900">
                          {cookie.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Category:{" "}
                          <span className="font-medium">{cookie.category}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cookie)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cookie.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {cookie.duration && (
                        <div>
                          <span className="font-medium">Duration:</span>{" "}
                          {cookie.duration}
                        </div>
                      )}
                      {cookie.provider && (
                        <div>
                          <span className="font-medium">Provider:</span>{" "}
                          {cookie.provider}
                        </div>
                      )}
                      {cookie.description && (
                        <div className="md:col-span-2">
                          <span className="font-medium">Description:</span>{" "}
                          {cookie.description}
                        </div>
                      )}
                      {cookie.purpose && (
                        <div className="md:col-span-2">
                          <span className="font-medium">Purpose:</span>{" "}
                          {cookie.purpose}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No custom cookies created yet.</p>
            <p className="text-sm mt-2">
              Click "Add New Cookie" to create your first custom cookie.
            </p>
          </div>
        )}
      </div>

      {/* Info message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Custom cookies you create will appear in the
          selected privacy preference categories and will be visible in both the
          admin preview and frontend banner. Make sure to save your changes
          after creating or editing cookies.
        </p>
      </div>
    </div>
  );
};

export default CreateCustomCookies;
